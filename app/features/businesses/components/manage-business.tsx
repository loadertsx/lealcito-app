import { Link } from "react-router";

type ManageBusinessProps = {
	business: { name: string; slug: string };
};

export function ManageBusiness({ business }: ManageBusinessProps) {
	return (
		<main>
			<h1>Administrar {business.name}</h1>
			<p>
				Esta sección es exclusiva del dueño. Su configuración llegará
				próximamente.
			</p>
			<Link to={`/b/${encodeURIComponent(business.slug)}`}>
				Volver al negocio
			</Link>
		</main>
	);
}
