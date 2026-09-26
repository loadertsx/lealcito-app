import { SectionHeading } from "./section";

// Every figure here is a product rule, not a marketing claim.
const facts = [
	{ value: "3", label: "membresías como máximo, para que elegir sea fácil" },
	{
		value: "1",
		label: "uso por beneficio cada mes, controlado por el sistema",
	},
	{ value: "0", label: "apps para descargar y contraseñas para recordar" },
];

export function Explainer() {
	return (
		<section
			id="que-es"
			className="mx-auto v-stack max-w-6xl gap-12 px-4 py-20 md:px-6 md:py-32"
		>
			<div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
				<SectionHeading
					kicker="Qué es"
					title="¿Qué es una membresía de Lealcito?"
				/>
				<div className="v-stack gap-5 text-ink-soft text-lg lg:pt-10">
					<p>
						Pensalo como una suscripción al lugar que tus clientes ya eligen. Se
						hacen socios y todos los meses reciben beneficios: un café, una
						clase extra, un descuento. Vos decidís cuáles.
					</p>
					<p>
						Las tarjetitas de cartón se pierden y las apps de puntos nadie las
						descarga. Una membresía es más simple: cada socio sabe qué le toca
						este mes y tu equipo sabe qué puede canjear.
					</p>
				</div>
			</div>
			<dl className="grid border-sand-200 border-t md:grid-cols-3">
				{facts.map((fact) => (
					<div
						key={fact.value}
						className="v-stack gap-2 border-sand-200 py-6 max-md:border-b md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
					>
						<dt className="font-extrabold text-6xl text-brand-600 leading-none tracking-tight">
							{fact.value}
						</dt>
						<dd className="text-ink-soft">{fact.label}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
