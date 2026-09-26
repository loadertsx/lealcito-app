import { describe, expect, test } from "bun:test";
import { assertSameOrigin } from "../app/core/security.server";
import {
	clearSessionCookie,
	sessionCookie,
} from "../app/features/auth/session-cookie.server";

describe("authentication HTTP boundaries", () => {
	test("accepts only form posts from the exact request origin", () => {
		const request = (origin?: string) =>
			new Request("https://lealcito.app/logout", {
				method: "POST",
				headers: origin ? { Origin: origin } : {},
			});

		expect(() =>
			assertSameOrigin(request("https://lealcito.app")),
		).not.toThrow();
		for (const origin of [
			undefined,
			"null",
			"https://other.example",
			"http://lealcito.app",
			"https://lealcito.app:8443",
		]) {
			let rejection: unknown;
			try {
				assertSameOrigin(request(origin));
			} catch (error) {
				rejection = error;
			}
			expect(rejection).toBeInstanceOf(Response);
			expect((rejection as Response).status).toBe(403);
		}
	});

	test("retains the identity cookie name, scope, and serialization", async () => {
		const token = "a".repeat(64);
		const cookie = await sessionCookie.serialize(token, {
			maxAge: 30 * 24 * 60 * 60,
			secure: true,
		});
		expect(cookie).toStartWith("lealcito_session=");
		expect(cookie).toContain("Max-Age=2592000");
		expect(cookie).toContain("Path=/");
		expect(cookie).toContain("HttpOnly");
		expect(cookie).toContain("SameSite=Lax");
		expect(cookie).toContain("Secure");
		expect(cookie).not.toContain("Domain=");
		expect(await sessionCookie.parse(cookie)).toBe(token);
		expect(await sessionCookie.parse(null)).toBeNull();
	});

	test("expires the cookie with Secure only on HTTPS", async () => {
		for (const protocol of ["https", "http"]) {
			const cookie = await clearSessionCookie(
				new Request(`${protocol}://lealcito.app/logout`),
			);
			expect(cookie).toStartWith("lealcito_session=");
			expect(cookie).toContain("Max-Age=0");
			expect(cookie).toContain("Path=/");
			expect(cookie).toContain("HttpOnly");
			expect(cookie).toContain("SameSite=Lax");
			expect(cookie.includes("Secure")).toBe(protocol === "https");
			expect(await sessionCookie.parse(cookie)).toBe("");
		}
	});
});
