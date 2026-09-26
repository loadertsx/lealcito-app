import { redirect } from "react-router";
import { getSessionUser } from "../../features/auth/queries.server";
import { BusinessBenefits } from "../../features/loyalty/components/business-benefits";
import { getCurrentBenefits } from "../../features/loyalty/queries.server";
import type { Route } from "./+types/business-benefits";

export function headers() {
	return { "Cache-Control": "private, no-store" };
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const user = await getSessionUser(request);
	if (!user) throw redirect(`/b/${encodeURIComponent(params.slug)}/login`);
	return getCurrentBenefits(params.slug, user.id);
}

export default function BusinessBenefitsRoute({
	loaderData,
}: Route.ComponentProps) {
	return (
		<BusinessBenefits
			business={loaderData.business}
			benefits={loaderData.benefits}
		/>
	);
}
