import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400..800&family=Kalam&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es-AR">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			{/* Extensions (e.g. ColorZilla) add attributes to <body> before hydration.
			    This only silences attribute mismatches on <body>, not its children. */}
			<body suppressHydrationWarning>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Algo salió mal";
	let details = "Ocurrió un error inesperado.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "No encontramos esta página" : "Error";
		details =
			error.status === 404
				? "Puede que el enlace esté mal escrito o que la página ya no exista."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="mx-auto v-stack max-w-3xl gap-4 px-4 py-16">
			<h1 className="font-bold text-4xl tracking-tight">{message}</h1>
			<p className="text-ink-soft">{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto rounded-2xl bg-sand-100 p-4 text-sm">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
