/** Opaque, unpredictable tokens; only SHA-256 digests are stored in D1. */
export function randomToken() {
	return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
		byte.toString(16).padStart(2, "0"),
	).join("");
}

export async function hashToken(token: string) {
	const bytes = new TextEncoder().encode(token);
	return Array.from(
		new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
		(byte) => byte.toString(16).padStart(2, "0"),
	).join("");
}

export function normalizeEmail(value: string) {
	const email = value.trim().toLowerCase();
	if (
		email.length > 254 ||
		!/^[\x21-\x7e]+$/.test(email) ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	) {
		return null;
	}
	return email;
}

/** Builds the email link from the configured app origin, never the request Host. */
export function magicLinkUrl(token: string, appOrigin: string | undefined) {
	if (!appOrigin) throw new Error("APP_ORIGIN is required");
	const link = new URL("/auth/confirm", appOrigin);
	link.searchParams.set("token", token);
	return link.toString();
}
