import { describe, expect, test } from "bun:test";
import { honeypotField, parseLead } from "../app/features/landing/lead";

const form = (fields: Record<string, string>) => {
	const data = new FormData();
	for (const [key, value] of Object.entries(fields)) data.set(key, value);
	return data;
};

const valid = {
	name: "  Lucía   Paredes ",
	email: " Lucia@Example.com ",
	business: "Casa\nFerrer",
	kind: "Gastronomía",
};

describe("landing lead form", () => {
	test("accepts a complete lead and normalizes its fields", () => {
		expect(parseLead(form(valid))).toEqual({
			kind: "lead",
			lead: {
				name: "Lucía Paredes",
				email: "lucia@example.com",
				business: "Casa Ferrer",
				kind: "Gastronomía",
			},
		});
	});

	test("reports every invalid field at once", () => {
		const result = parseLead(
			form({ name: "", email: "nope", business: " ", kind: "Minería" }),
		);
		expect(result.kind).toBe("invalid");
		if (result.kind !== "invalid") return;
		expect(Object.keys(result.errors).sort()).toEqual([
			"business",
			"email",
			"kind",
			"name",
		]);
	});

	test("treats a filled honeypot as spam", () => {
		expect(
			parseLead(form({ ...valid, [honeypotField]: "https://spam.example" })),
		).toEqual({
			kind: "spam",
		});
	});
});
