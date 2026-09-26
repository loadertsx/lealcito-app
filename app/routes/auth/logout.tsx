import { redirect } from "react-router";
import { assertSameOrigin } from "../../core/security.server";
import { revokeSession } from "../../features/auth/mutations.server";
import { clearSessionCookie } from "../../features/auth/session-cookie.server";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
	assertSameOrigin(request);
	await revokeSession(request);
	return redirect("/", {
		headers: {
			"Set-Cookie": await clearSessionCookie(request),
			"Cache-Control": "no-store",
		},
	});
}
