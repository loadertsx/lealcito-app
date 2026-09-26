import { Form, Link } from "react-router";

type BusinessLoginProps = {
	business: { name: string; slug: string };
	result?: { sent: boolean; error: string | null };
};

export function BusinessLogin({ business, result }: BusinessLoginProps) {
	return (
		<main>
			<h1>Ingresar a {business.name}</h1>
			<p>
				Te enviaremos un enlace para iniciar sesión o crear tu cuenta, sin
				contraseña.
			</p>
			{result?.sent ? (
				<p>Si podemos enviar el enlace, llegará a tu correo en unos minutos.</p>
			) : (
				<Form method="post">
					<label htmlFor="email">Email</label>{" "}
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
					/>{" "}
					<button type="submit">Enviar enlace</button>
					{result?.error && <p role="alert">{result.error}</p>}
				</Form>
			)}
			<p>
				<Link to={`/b/${encodeURIComponent(business.slug)}`}>
					Volver al negocio
				</Link>
			</p>
		</main>
	);
}
