import { assertSameOrigin } from "../../core/security.server";
import { LandingPage } from "../../features/landing/components/landing-page";
import { submitLead } from "../../features/landing/mutations.server";
import type { Route } from "./+types/home";

const title = "Lealcito · Membresías para tus clientes de siempre";
const description =
	"Armá hasta tres membresías con beneficios que se renuevan cada mes. Tus clientes se suman con su email y tu equipo canjea con un toque.";

export function meta(_: Route.MetaArgs) {
	return [
		{ title },
		{ name: "description", content: description },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:type", content: "website" },
	];
}

export async function action({ request }: Route.ActionArgs) {
	assertSameOrigin(request);
	return submitLead(await request.formData());
}

export default function Home() {
	return <LandingPage />;
}
