import { getSessionUser } from "../../features/auth/queries.server";
import { BusinessHome } from "../../features/businesses/components/business-home";
import { getBusinessHome } from "../../features/businesses/queries.server";
import type { Route } from "./+types/business";

export function headers() {
	return { "Cache-Control": "private, no-store" };
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const user = await getSessionUser(request);
	const business = await getBusinessHome(params.slug, user?.id ?? null);
	if (!business) throw new Response("Negocio no encontrado", { status: 404 });
	return { business, email: user?.email ?? null };
}

export default function Business({ loaderData }: Route.ComponentProps) {
	return (
		<BusinessHome business={loaderData.business} email={loaderData.email} />
	);
}
