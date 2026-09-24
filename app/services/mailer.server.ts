import { env } from "cloudflare:workers";
import { Resend } from "resend";
import { magicLinkUrl } from "./auth-token";

/** Sends a login link using the configured, verified sender. No token is logged. */
export async function sendMagicLink(email: string, token: string) {
	const link = magicLinkUrl(
		token,
		(env as typeof env & { APP_ORIGIN?: string }).APP_ORIGIN,
	);

	const resend = new Resend(env.RESEND_API_KEY);
	const { error } = await resend.emails.send({
		from: env.MAILER_FROM,
		to: email,
		subject: "Tu enlace para entrar a Lealcito",
		text: `Para confirmar tu acceso a Lealcito, abrí este enlace (válido durante 15 minutos):\n\n${link}\n\nSi no lo solicitaste, podés ignorar este mensaje.`,
	});
	if (error)
		throw new Error(`Resend could not send the magic link: ${error.name}`);
}
