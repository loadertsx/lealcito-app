import { Link, redirect } from "react-router";
import { getSessionUser } from "../../services/auth.server";
import { requireBusinessStaff } from "../../services/business.server";
import type { Route } from "./+types/business-staff";

export function headers() {
	return { "Cache-Control": "private, no-store" };
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const user = await getSessionUser(request);
	if (!user) throw redirect(`/b/${encodeURIComponent(params.slug)}/login`);
	return requireBusinessStaff(params.slug, user.id, "work");
}

export default function StaffArea({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<h1>Personal de {loaderData.business.name}</h1>
			<p>Acceso para {loaderData.role === "admin" ? "dueños" : "staff"}.</p>
			<p>Las operaciones del personal estarán disponibles próximamente.</p>
			<Link to={`/b/${encodeURIComponent(loaderData.business.slug)}`}>
				Volver al negocio
			</Link>
		</main>
	);
}
