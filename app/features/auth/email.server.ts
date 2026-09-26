import { env } from "cloudflare:workers";
import { sendEmail } from "../../core/mailer.server";
import { magicLinkUrl } from "./token";

/** Sends a login link using the configured app origin. No token is logged. */
export async function sendMagicLink(email: string, token: string) {
	const link = magicLinkUrl(token, env.APP_ORIGIN);
	await sendEmail({
		to: email,
		subject: "Tu enlace para entrar a Lealcito",
		text: `Para confirmar tu acceso a Lealcito, abrí este enlace (válido durante 15 minutos):\n\n${link}\n\nSi no lo solicitaste, podés ignorar este mensaje.`,
	});
}
