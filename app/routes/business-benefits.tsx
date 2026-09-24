import { Link, redirect } from "react-router";
import { getSessionUser } from "../services/auth.server";
import { getCurrentBenefits } from "../services/business.server";
import type { Route } from "./+types/business-benefits";

export function headers() {
	return { "Cache-Control": "private, no-store" };
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const user = await getSessionUser(request);
	if (!user) throw redirect(`/b/${encodeURIComponent(params.slug)}/login`);
	return getCurrentBenefits(params.slug, user.id);
}

export default function BusinessBenefits({ loaderData }: Route.ComponentProps) {
	const { business, benefits } = loaderData;
	return (
		<main>
			<h1>Mis beneficios en {business.name}</h1>
			{benefits.length ? (
				<ul>
					{benefits.map((benefit) => (
						<li key={benefit.id}>
							<strong>{benefit.title}</strong>: {benefit.description} —{" "}
							{benefit.redeemedAt ? "Utilizado" : "Disponible"}
						</li>
					))}
				</ul>
			) : (
				<p>No hay beneficios otorgados para el período actual.</p>
			)}
			<Link to={`/b/${encodeURIComponent(business.slug)}`}>
				Volver al negocio
			</Link>
		</main>
	);
}
