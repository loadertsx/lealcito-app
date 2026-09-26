import { Link } from "react-router";

type BusinessBenefitsProps = {
	business: { name: string; slug: string };
	benefits: {
		id: string;
		title: string;
		description: string;
		redeemedAt: Date | null;
	}[];
};

export function BusinessBenefits({
	business,
	benefits,
}: BusinessBenefitsProps) {
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
