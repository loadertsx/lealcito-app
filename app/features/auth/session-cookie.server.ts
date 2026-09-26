import { createCookie } from "react-router";

/** Shared identity cookie; business permissions never live in this cookie. */
export const sessionCookie = createCookie("lealcito_session", {
	httpOnly: true,
	path: "/",
	sameSite: "lax",
});

export async function clearSessionCookie(request: Request) {
	return sessionCookie.serialize("", {
		maxAge: 0,
		secure: new URL(request.url).protocol === "https:",
	});
}
