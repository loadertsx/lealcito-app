import { Form, Link } from "react-router";

type AuthConfirmProps = {
	valid: boolean;
	token: string;
	error?: string;
};

export function AuthConfirm({ valid, token, error }: AuthConfirmProps) {
	return (
		<main>
			<h1>Confirmar acceso</h1>
			{valid ? (
				<Form method="post">
					<input type="hidden" name="token" value={token} />
					<button type="submit">Confirmar e iniciar sesión</button>
				</Form>
			) : (
				<p>
					El enlace no es válido o expiró. Solicitá uno nuevo desde el negocio.
				</p>
			)}
			{error && <p role="alert">{error}</p>}
			<p>
				<Link to="/">Ir al inicio</Link>
			</p>
		</main>
	);
}
