import { Icon, type IconName } from "./icon";
import { SectionHeading } from "./section";

const audiences: { icon: IconName; kind: string; idea: string }[] = [
	{ icon: "cup", kind: "Cafetería", idea: "Un café de filtro por mes" },
	{
		icon: "dumbbell",
		kind: "Estudio de pilates",
		idea: "Una clase extra al mes",
	},
	{
		icon: "plate",
		kind: "Restaurante",
		idea: "Postre sin cargo en una visita",
	},
	{ icon: "scissors", kind: "Barbería", idea: "Perfilado de barba gratis" },
	{ icon: "spark", kind: "Centro de estética", idea: "20% en un tratamiento" },
	{ icon: "glass", kind: "Vinoteca", idea: "Una cata privada al mes" },
	{
		icon: "car",
		kind: "Lavadero de autos",
		idea: "Aspirado interior incluido",
	},
	{ icon: "book", kind: "Librería", idea: "10% en un libro por mes" },
];

export function Audiences() {
	return (
		<section
			id="para-quien"
			className="mx-auto v-stack max-w-6xl gap-12 px-4 py-20 md:px-6 md:py-32"
		>
			<SectionHeading
				kicker="Para quién"
				title="Para cualquier lugar al que la gente vuelve."
			>
				Si tus clientes te eligen todos los meses, ya tenés socios. Algunas
				ideas de beneficios:
			</SectionHeading>
			<ul className="grid border-sand-200 border-t md:grid-cols-2 md:gap-x-12">
				{audiences.map((audience) => (
					<li
						key={audience.kind}
						className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-0.5 border-sand-200 border-b py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
					>
						<span className="circle center row-span-2 size-10.5 bg-sand-100 text-brand-600 sm:row-span-1">
							<Icon name={audience.icon} />
						</span>
						<span className="font-semibold text-lg tracking-tight">
							{audience.kind}
						</span>
						<span className="text-ink-soft sm:text-right">{audience.idea}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
