import { cn } from "~/shared/lib/cn";
import { Icon, type IconName } from "./icon";

type Pill = { icon: IconName; label: string };

const rows: Pill[][] = [
	[
		{ icon: "phone", label: "Sin app para descargar" },
		{ icon: "card", label: "Hasta 3 membresías" },
		{ icon: "calendar", label: "Beneficios que se renuevan cada mes" },
		{ icon: "mail", label: "Tus socios entran con su email" },
		{ icon: "check", label: "Canje con un toque" },
		{ icon: "shield", label: "Un beneficio, un uso" },
	],
	[
		{ icon: "clock", label: "Historial de cada canje" },
		{ icon: "users", label: "Roles para dueño y equipo" },
		{ icon: "store", label: "Tu propia página de socios" },
		{ icon: "qr", label: "Un QR en el mostrador y listo" },
		{ icon: "phone", label: "Funciona en cualquier celular" },
		{ icon: "spark", label: "Beneficios que vos elegís" },
	],
];

/** Two rows of feature pills drifting in opposite directions. */
export function FeaturePills() {
	return (
		<section
			aria-label="Lo que incluye Lealcito"
			className="v-stack gap-3 overflow-hidden border-sand-200 border-b py-8 [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]"
		>
			{rows.map((pills, index) => (
				<div
					key={pills[0].label}
					className={cn(
						"h-stack w-max gap-3",
						index === 0 ? "animate-marquee" : "animate-marquee-reverse",
					)}
				>
					{/* The second copy makes the loop seamless and is hidden from screen readers. */}
					{[false, true].map((copy) =>
						pills.map((pill) => (
							<span
								key={`${copy}-${pill.label}`}
								aria-hidden={copy || undefined}
								className="h-stack items-center gap-2.5 whitespace-nowrap rounded-full border border-sand-200 bg-white py-2.5 pr-4.5 pl-3 font-medium"
							>
								<span className="circle center size-7.5 bg-brand-50 text-brand-600">
									<Icon name={pill.icon} className="size-4" />
								</span>
								{pill.label}
							</span>
						)),
					)}
				</div>
			))}
		</section>
	);
}
