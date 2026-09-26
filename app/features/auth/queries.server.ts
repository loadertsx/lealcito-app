import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../../core/db.server";
import { magicLinkRequests, sessions, users } from "./schema";
import { sessionCookie } from "./session-cookie.server";
import { hashToken } from "./token";

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
