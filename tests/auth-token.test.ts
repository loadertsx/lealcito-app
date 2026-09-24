import { describe, expect, test } from "bun:test";
import {
	hashToken,
	magicLinkUrl,
	normalizeEmail,
	randomToken,
} from "../app/services/auth-token";

describe("passwordless token boundaries", () => {
	test("creates unpredictable tokens and stores only fixed-size digests", async () => {
		const first = randomToken();
		const second = randomToken();
		expect(first).toMatch(/^[a-f0-9]{64}$/);
		expect(first).not.toBe(second);
		expect(await hashToken(first)).toMatch(/^[a-f0-9]{64}$/);
		expect(await hashToken(first)).not.toBe(first);
		expect(await hashToken(first)).toBe(await hashToken(first));
	});

	test("normalizes addresses consistently with the users table", () => {
		expect(normalizeEmail("  USER@EXAMPLE.COM ")).toBe("user@example.com");
		expect(normalizeEmail("no-address")).toBeNull();
		expect(normalizeEmail("a@b.com\nBcc: victim@example.com")).toBeNull();
	});

	test("builds links only from the configured app origin", () => {
		expect(() => magicLinkUrl("token", undefined)).toThrow("APP_ORIGIN");
		expect(magicLinkUrl("token", "https://lealcito.app")).toBe(
			"https://lealcito.app/auth/confirm?token=token",
		);
		expect(magicLinkUrl("token", "http://localhost:5173")).toBe(
			"http://localhost:5173/auth/confirm?token=token",
		);
		expect(() => magicLinkUrl("token", "invalid-origin")).toThrow();
	});
});
