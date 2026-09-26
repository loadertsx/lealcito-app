import { Link } from "react-router";
import type { StaffRole } from "../schema";

type StaffAreaProps = {
	business: { name: string; slug: string };
	role: StaffRole;
};

export function StaffArea({ business, role }: StaffAreaProps) {
	return (
		<main>
			<h1>Personal de {business.name}</h1>
			<p>Acceso para {role === "admin" ? "dueños" : "staff"}.</p>
			<p>Las operaciones del personal estarán disponibles próximamente.</p>
			<Link to={`/b/${encodeURIComponent(business.slug)}`}>
				Volver al negocio
			</Link>
		</main>
	);
}
