import { normalizeEmail } from "../auth/token";

/** Pure lead-form rules shared by the form component and the server mutation. */

export const businessKinds = [
	"Gastronomía",
	"Fitness y bienestar",
	"Belleza y estética",
	"Tienda",
	"Servicios",
	"Otro",
] as const;

export type BusinessKind = (typeof businessKinds)[number];

export type Lead = {
	name: string;
	email: string;
	business: string;
	kind: BusinessKind;
};

export type LeadField = keyof Lead;
export type LeadErrors = Partial<Record<LeadField, string>>;

/** What the form shows after a submission. */
export type LeadResult =
	| { status: "sent"; name: string; email: string }
	| { status: "invalid"; errors: LeadErrors }
	| { status: "failed" };

/** Name of the hidden field bots tend to fill in. */
export const honeypotField = "website";

const text = (form: FormData, key: string) => {
	const value = form.get(key);
	// Single-line fields: collapse newlines so nothing spills into the email subject.
	return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
};

export type ParsedLead =
	| { kind: "lead"; lead: Lead }
	| { kind: "invalid"; errors: LeadErrors }
	| { kind: "spam" };

export function parseLead(form: FormData): ParsedLead {
	if (text(form, honeypotField)) return { kind: "spam" };

	const name = text(form, "name");
	const business = text(form, "business");
	const email = normalizeEmail(text(form, "email"));
	const kind = text(form, "kind");

	const errors: LeadErrors = {};
	if (!name || name.length > 120) errors.name = "Contanos tu nombre.";
	if (!email) errors.email = "Ingresá un email válido.";
	if (!business || business.length > 160)
		errors.business = "Contanos cómo se llama tu negocio.";
	if (!businessKinds.includes(kind as BusinessKind))
		errors.kind = "Elegí un rubro de la lista.";

	if (Object.keys(errors).length > 0 || !email)
		return { kind: "invalid", errors };
	return {
		kind: "lead",
		lead: { name, email, business, kind: kind as BusinessKind },
	};
}
