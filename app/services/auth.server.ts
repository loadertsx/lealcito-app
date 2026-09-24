import { and, eq, gt, isNull } from "drizzle-orm";
import { createCookie } from "react-router";
import { db } from "../../database/client";
import { magicLinkRequests, sessions, users } from "../../database/schema";
import { hashToken, normalizeEmail, randomToken } from "./auth-token";

const LINK_LIFETIME_MS = 15 * 60 * 1000;
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_EMAIL = 3;

const sessionCookie = createCookie("lealcito_session", {
	httpOnly: true,
	path: "/",
	sameSite: "lax",
});

/** Returns an opaque token to mail, or null when the email is rate limited. */
export async function requestMagicLink(
	emailInput: string,
	businessSlug: string,
) {
	const email = normalizeEmail(emailInput);
	if (!email) return { kind: "invalid-email" as const };

	const recent = await db.query.magicLinkRequests.findMany({
		where: {
			email,
			createdAt: { gt: new Date(Date.now() - REQUEST_WINDOW_MS) },
		},
		columns: { id: true },
		limit: MAX_REQUESTS_PER_EMAIL,
	});
	if (recent.length >= MAX_REQUESTS_PER_EMAIL) {
		return { kind: "limited" as const };
	}

	const token = randomToken();
	await db.insert(magicLinkRequests).values({
		email,
		tokenHash: await hashToken(token),
		businessSlug,
		expiresAt: new Date(Date.now() + LINK_LIFETIME_MS),
	});
	return { kind: "ready" as const, token, email };
}

/** Does not consume a token; only the confirmation action may do so. */
export async function inspectMagicLink(token: string) {
	if (!/^[a-f0-9]{64}$/.test(token)) return null;
	const [link] = await db
		.select({ businessSlug: magicLinkRequests.businessSlug })
		.from(magicLinkRequests)
		.where(
			and(
				eq(magicLinkRequests.tokenHash, await hashToken(token)),
				isNull(magicLinkRequests.usedAt),
				gt(magicLinkRequests.expiresAt, new Date()),
			),
		)
		.limit(1);
	return link ?? null;
}

/** Atomically claims an unexpired one-use link, then issues an identity session. */
export async function confirmMagicLink(token: string, request: Request) {
	if (!/^[a-f0-9]{64}$/.test(token)) return null;
	const [link] = await db
		.update(magicLinkRequests)
		.set({ usedAt: new Date() })
		.where(
			and(
				eq(magicLinkRequests.tokenHash, await hashToken(token)),
				isNull(magicLinkRequests.usedAt),
				gt(magicLinkRequests.expiresAt, new Date()),
			),
		)
		.returning({
			email: magicLinkRequests.email,
			businessSlug: magicLinkRequests.businessSlug,
		});
	if (!link) return null;

	// Concurrent confirmations of distinct links for the same address reuse one user.
	await db.insert(users).values({ email: link.email }).onConflictDoNothing();
	const [user] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, link.email))
		.limit(1);
	if (!user) throw new Error("Verified user could not be loaded");

	const sessionToken = randomToken();
	await db.insert(sessions).values({
		userId: user.id,
		tokenHash: await hashToken(sessionToken),
		expiresAt: new Date(Date.now() + SESSION_LIFETIME_MS),
	});
	// Logging into another account in the same browser revokes the previous session.
	await revokeSession(request);
	return {
		businessSlug: link.businessSlug,
		cookie: await sessionCookie.serialize(sessionToken, {
			maxAge: SESSION_LIFETIME_MS / 1000,
			secure: new URL(request.url).protocol === "https:",
		}),
	};
}

/** A session identifies a user only; business permissions are checked separately. */
export async function getSessionUser(request: Request) {
	const token = await sessionCookie.parse(request.headers.get("Cookie"));
	if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return null;
	const [result] = await db
		.select({ id: users.id, email: users.email })
		.from(sessions)
		.innerJoin(users, eq(users.id, sessions.userId))
		.where(
			and(
				eq(sessions.tokenHash, await hashToken(token)),
				gt(sessions.expiresAt, new Date()),
			),
		)
		.limit(1);
	return result ?? null;
}

export async function revokeSession(request: Request) {
	const token = await sessionCookie.parse(request.headers.get("Cookie"));
	if (typeof token === "string" && /^[a-f0-9]{64}$/.test(token)) {
		await db
			.delete(sessions)
			.where(eq(sessions.tokenHash, await hashToken(token)));
	}
}

export async function clearSessionCookie(request: Request) {
	return sessionCookie.serialize("", {
		maxAge: 0,
		secure: new URL(request.url).protocol === "https:",
	});
}

/** Reject cross-origin form posts before performing authentication mutations. */
export function assertSameOrigin(request: Request) {
	const origin = request.headers.get("Origin");
	if (origin !== new URL(request.url).origin) {
		throw new Response("Forbidden", { status: 403 });
	}
}
