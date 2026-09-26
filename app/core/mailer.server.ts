import { env } from "cloudflare:workers";
import { Resend } from "resend";

/** Sends plain-text mail from the configured, verified sender. Never logs content. */
export async function sendEmail(message: {
	to: string;
	subject: string;
	text: string;
}) {
	const resend = new Resend(env.RESEND_API_KEY);
	const { error } = await resend.emails.send({
		from: env.MAILER_FROM,
		...message,
	});
	if (error) throw new Error(`Resend could not send email: ${error.name}`);
}
