import { Form, Link } from "react-router";
import { assertSameOrigin, requestMagicLink } from "../../services/auth.server";
import { getBusinessHome } from "../../services/business.server";
import { sendMagicLink } from "../../services/mailer.server";
import type { Route } from "./+types/business-login";

export function headers() {
	return { "Cache-Control": "no-store" };
}

export async function loader({ params }: Route.LoaderArgs) {
	const business = await getBusinessHome(params.slug);
	if (!business) throw new Response("Negocio no encontrado", { status: 404 });
	return { business };
}

export async function action({ params, request }: Route.ActionArgs) {
	assertSameOrigin(request);
	const business = await getBusinessHome(params.slug);
	if (!business) throw new Response("Negocio no encontrado", { status: 404 });
	const form = await request.formData();
	const email = form.get("email");
	if (typeof email !== "string" || email.length > 320) {
		return { sent: false, error: "Ingresá un email válido." };
	}
	const result = await requestMagicLink(email, business.slug);
	if (result.kind === "invalid-email") {
		return { sent: false, error: "Ingresá un email válido." };
	}
	if (result.kind === "ready") {
		try {
			await sendMagicLink(result.email, result.token);
		} catch (error) {
			// The user sees the same answer. Never log the token or the email.
			console.error(
				"Magic link delivery failed",
				error instanceof Error ? error.name : "unknown",
			);
		}
	}
	return { sent: true, error: null };
}

export default function BusinessLogin({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return (
		<main>
			<h1>Ingresar a {loaderData.business.name}</h1>
			<p>
				Te enviaremos un enlace para iniciar sesión o crear tu cuenta, sin
				contraseña.
			</p>
			{actionData?.sent ? (
				<p>Si podemos enviar el enlace, llegará a tu correo en unos minutos.</p>
			) : (
				<Form method="post">
					<label htmlFor="email">Email</label>{" "}
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
					/>{" "}
					<button type="submit">Enviar enlace</button>
					{actionData?.error && <p role="alert">{actionData.error}</p>}
				</Form>
			)}
			<p>
				<Link to={`/b/${encodeURIComponent(loaderData.business.slug)}`}>
					Volver al negocio
				</Link>
			</p>
		</main>
	);
}
