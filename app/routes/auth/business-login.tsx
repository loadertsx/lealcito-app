import { assertSameOrigin } from "../../core/security.server";
import { BusinessLogin } from "../../features/auth/components/business-login";
import { sendMagicLink } from "../../features/auth/email.server";
import { requestMagicLink } from "../../features/auth/mutations.server";
import { getBusinessHome } from "../../features/businesses/queries.server";
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

export default function BusinessLoginRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return <BusinessLogin business={loaderData.business} result={actionData} />;
}
