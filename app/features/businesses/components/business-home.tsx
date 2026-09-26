import { Form, Link } from "react-router";
import type { BusinessMembershipStatus } from "../../loyalty/schema";
import type { StaffRole } from "../schema";

type BusinessHomeProps = {
	business: {
		name: string;
		slug: string;
		hasEntered: boolean;
		staffRole: StaffRole | null;
		membershipStatus: BusinessMembershipStatus | null;
	};
	email: string | null;
};

export function BusinessHome({ business, email }: BusinessHomeProps) {
	return (
		<main>
			<h1>{business.name}</h1>
			<p>
				Conocé este negocio en Lealcito. Las promociones estarán disponibles
				próximamente.
			</p>
			{email && <p>Sesión iniciada como {email}.</p>}
			{business.staffRole && (
				<p>
					Acceso al negocio como{" "}
					{business.staffRole === "admin" ? "dueño" : "staff"}.
				</p>
			)}
			{business.hasEntered ? (
				<>
					<p>Ya entraste a este negocio.</p>
					{business.membershipStatus === "active" ? (
						<p>Tenés una membresía activa.</p>
					) : business.membershipStatus === "suspended" ? (
						<p>Tu membresía está suspendida.</p>
					) : (
						<p>Aún no tenés membresía.</p>
					)}
				</>
			) : (
				<Form
					action={`/b/${encodeURIComponent(business.slug)}/enter`}
					method="post"
				>
					<button type="submit">
						{business.staffRole ? "Entrar como cliente" : "Entrar"}
					</button>
				</Form>
			)}
			{business.membershipStatus === "active" && (
				<p>
					<Link to={`/b/${encodeURIComponent(business.slug)}/benefits`}>
						Mis beneficios
					</Link>
				</p>
			)}
			{business.staffRole && (
				<p>
					<Link to={`/admin/b/${encodeURIComponent(business.slug)}/staff`}>
						Espacio del personal
					</Link>
				</p>
			)}
			{business.staffRole === "admin" && (
				<p>
					<Link to={`/admin/b/${encodeURIComponent(business.slug)}/manage`}>
						Administrar negocio
					</Link>
				</p>
			)}
			{email && (
				<Form action="/logout" method="post">
					<button type="submit">Cerrar sesión</button>
				</Form>
			)}
		</main>
	);
}
