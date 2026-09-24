import { Form, Link, redirect } from "react-router";
import {
	assertSameOrigin,
	confirmMagicLink,
	inspectMagicLink,
} from "../services/auth.server";
import { getBusinessHome } from "../services/business.server";
import type { Route } from "./+types/auth-confirm";

// In particular, do not send the URL's token to third-party assets via Referer.
export function headers() {
	return { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };
}

export async function loader({ request }: Route.LoaderArgs) {
	const token = new URL(request.url).searchParams.get("token") ?? "";
	const link = await inspectMagicLink(token);
	return { valid: !!link, token: link ? token : "" };
}

export async function action({ request }: Route.ActionArgs) {
	assertSameOrigin(request);
	const form = await request.formData();
	const token = form.get("token");
	if (typeof token !== "string")
		return { error: "El enlace no es válido o expiró." };
	const result = await confirmMagicLink(token, request);
	if (!result) return { error: "El enlace no es válido o expiró." };
	const business = result.businessSlug
		? await getBusinessHome(result.businessSlug)
		: null;
	return redirect(business ? `/b/${encodeURIComponent(business.slug)}` : "/", {
		headers: { "Set-Cookie": result.cookie, "Cache-Control": "no-store" },
	});
}

export default function AuthConfirm({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return (
		<main>
			<h1>Confirmar acceso</h1>
			{loaderData.valid ? (
				<Form method="post">
					<input type="hidden" name="token" value={loaderData.token} />
					<button type="submit">Confirmar e iniciar sesión</button>
				</Form>
			) : (
				<p>
					El enlace no es válido o expiró. Solicitá uno nuevo desde el negocio.
				</p>
			)}
			{actionData?.error && <p role="alert">{actionData.error}</p>}
			<p>
				<Link to="/">Ir al inicio</Link>
			</p>
		</main>
	);
}
