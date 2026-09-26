import { redirect } from "react-router";
import { getSessionUser } from "../../features/auth/queries.server";
import { ManageBusiness } from "../../features/businesses/components/manage-business";
import { requireBusinessStaff } from "../../features/businesses/queries.server";
import type { Route } from "./+types/business-manage";

export function headers() {
	return { "Cache-Control": "private, no-store" };
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const user = await getSessionUser(request);
	if (!user) throw redirect(`/b/${encodeURIComponent(params.slug)}/login`);
	return requireBusinessStaff(params.slug, user.id, "manage");
}

export default function ManageBusinessRoute({
	loaderData,
}: Route.ComponentProps) {
	return <ManageBusiness business={loaderData.business} />;
}
