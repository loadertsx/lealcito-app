import { redirect } from "react-router";
import { assertSameOrigin } from "../../core/security.server";
import { AuthConfirm } from "../../features/auth/components/auth-confirm";
import { confirmMagicLink } from "../../features/auth/mutations.server";
import { inspectMagicLink } from "../../features/auth/queries.server";
import { getBusinessHome } from "../../features/businesses/queries.server";
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

export default function AuthConfirmRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return (
		<AuthConfirm
			valid={loaderData.valid}
			token={loaderData.token}
			error={actionData?.error}
		/>
	);
}
