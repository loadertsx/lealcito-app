import { redirect } from "react-router";
import { getSessionUser } from "../../features/auth/queries.server";
import { StaffArea } from "../../features/businesses/components/staff-area";
import { requireBusinessStaff } from "../../features/businesses/queries.server";
import type { Route } from "./+types/business-staff";

export function headers() {
	return { "Cache-Control": "private, no-store" };
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const user = await getSessionUser(request);
	if (!user) throw redirect(`/b/${encodeURIComponent(params.slug)}/login`);
	return requireBusinessStaff(params.slug, user.id, "work");
}

export default function StaffAreaRoute({ loaderData }: Route.ComponentProps) {
	return <StaffArea business={loaderData.business} role={loaderData.role} />;
}
