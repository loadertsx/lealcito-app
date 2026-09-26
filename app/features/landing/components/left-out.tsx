import { useRef } from "react";
import { cn } from "~/shared/lib/cn";
import { SectionHeading } from "./section";
import { useInView } from "./use-scene";

const omissions = [
	{
		thing: "Puntos que hay que calcular",
		why: "Un beneficio es un beneficio. Se usa o no se usa.",
	},
	{
		thing: "Una app más para descargar",
		why: "Funciona desde el navegador del celular.",
	},
	{
		thing: "Contraseñas que nadie recuerda",
		why: "Se entra con un enlace por email.",
	},
	{ thing: "Diez niveles de membresía", why: "Con tres alcanza y sobra." },
];

// Delays are listed so Tailwind can see each class.
const delays = ["delay-150", "delay-300", "delay-500", "delay-700"];

export function LeftOut() {
	const list = useRef<HTMLUListElement>(null);
	const struck = useInView(list, { threshold: 0.5, once: true });

	return (
		<section className="mx-auto v-stack max-w-3xl gap-8 px-4 pb-20 md:px-6 md:pb-32">
			<SectionHeading
				kicker="Lo que no hacemos"
				title="Lo que dejamos afuera, a propósito."
			/>
			<ul ref={list} className="v-stack gap-4">
				{omissions.map((item, index) => (
					<li key={item.thing} className="v-stack gap-0.5">
						<span className="font-semibold text-2xl tracking-tight md:text-3xl">
							<span
								className={cn(
									"bg-linear-to-r from-danger to-danger bg-size-[0%_3px] bg-position-[0_58%] bg-no-repeat box-decoration-clone",
									"transition-[background-size] duration-500 ease-out-soft",
									delays[index],
									struck && "bg-size-[100%_3px]",
								)}
							>
								{item.thing}
							</span>
						</span>
						<span className="font-hand text-lg text-muted">{item.why}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
