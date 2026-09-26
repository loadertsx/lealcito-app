import { redirect } from "react-router";
import { assertSameOrigin } from "../../core/security.server";
import { getSessionUser } from "../../features/auth/queries.server";
import { enterBusiness } from "../../features/businesses/mutations.server";
import { getBusinessHome } from "../../features/businesses/queries.server";
import type { Route } from "./+types/business-enter";

export async function action({ params, request }: Route.ActionArgs) {
	assertSameOrigin(request);
	const user = await getSessionUser(request);
	if (!user) {
		const business = await getBusinessHome(params.slug);
		if (!business) throw new Response("Negocio no encontrado", { status: 404 });
		return redirect(`/b/${encodeURIComponent(business.slug)}/login`);
	}

	const business = await enterBusiness(params.slug, user.id);
	if (!business) throw new Response("Negocio no encontrado", { status: 404 });
	return redirect(`/b/${encodeURIComponent(business.slug)}`);
}
