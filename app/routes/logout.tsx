import { redirect } from "react-router";
import {
	assertSameOrigin,
	clearSessionCookie,
	revokeSession,
} from "../services/auth.server";
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
