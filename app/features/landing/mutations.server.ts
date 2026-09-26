import { env } from "cloudflare:workers";
import { sendEmail } from "../../core/mailer.server";
import { type LeadResult, parseLead } from "./lead";

/**
 * Validates an early-access request and mails it to the team inbox (LEADS_TO).
 * Leads are not stored. Bots that fill the honeypot get the same success
 * answer so they learn nothing.
 */
export async function submitLead(form: FormData): Promise<LeadResult> {
	const parsed = parseLead(form);
	if (parsed.kind === "invalid")
		return { status: "invalid", errors: parsed.errors };
	if (parsed.kind === "spam") return { status: "sent", name: "", email: "" };

	const { lead } = parsed;
	try {
		await sendEmail({
			to: env.LEADS_TO,
			subject: `Nuevo negocio interesado: ${lead.business}`,
			text: [
				`Nombre: ${lead.name}`,
				`Email: ${lead.email}`,
				`Negocio: ${lead.business}`,
				`Rubro: ${lead.kind}`,
			].join("\n"),
		});
	} catch (error) {
		// Never log the lead's personal data.
		console.error(
			"Lead delivery failed",
			error instanceof Error ? error.name : "unknown",
		);
		return { status: "failed" };
	}
	return { status: "sent", name: lead.name.split(" ")[0], email: lead.email };
}
