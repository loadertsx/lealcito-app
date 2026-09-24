import { Link, redirect } from "react-router";
import { getSessionUser } from "../services/auth.server";
import { requireBusinessStaff } from "../services/business.server";
import type { Route } from "./+types/business-manage";

export function headers() {
	return { "Cache-Control": "private, no-store" };
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const user = await getSessionUser(request);
	if (!user) throw redirect(`/b/${encodeURIComponent(params.slug)}/login`);
	return requireBusinessStaff(params.slug, user.id, "manage");
}

export default function ManageBusiness({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<h1>Administrar {loaderData.business.name}</h1>
			<p>
				Esta sección es exclusiva del dueño. Su configuración llegará
				próximamente.
			</p>
			<Link to={`/b/${encodeURIComponent(loaderData.business.slug)}`}>
				Volver al negocio
			</Link>
		</main>
	);
}
