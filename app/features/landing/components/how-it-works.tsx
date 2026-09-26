import {
	type ComponentType,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "~/shared/lib/cn";
import { HandNote } from "./hand-note";
import { Icon, type IconName } from "./icon";
import { Phone } from "./phone";
import {
	BuilderScene,
	CounterScene,
	EmailScene,
	RenewScene,
} from "./phone-scenes";
import { SectionHeading } from "./section";
import { useInView, usePrefersReducedMotion } from "./use-scene";

type Step = {
	icon: IconName;
	title: string;
	description: string;
	/** How long the step stays selected before advancing, in on-screen ms. */
	duration: number;
	Scene: ComponentType<{ screen: RefObject<HTMLDivElement | null> }>;
};

const steps: Step[] = [
	{
		icon: "card",
		title: "Armá tus membresías",
		description:
			"Hasta tres niveles, cada uno con sus beneficios. Los cambiás cuando quieras.",
		duration: 7000,
		Scene: BuilderScene,
	},
	{
		icon: "mail",
		title: "Tus clientes se suman con su email",
		description:
			"Les llega un enlace, lo tocan y listo. Sin app y sin contraseña.",
		duration: 8500,
		Scene: EmailScene,
	},
	{
		icon: "check",
		title: "Tu equipo canjea con un toque",
		description:
			"Buscan al socio, tocan el beneficio y queda registrado. Nadie lo usa dos veces.",
		duration: 9500,
		Scene: CounterScene,
	},
	{
		icon: "calendar",
		title: "Cada mes, beneficios nuevos",
		description:
			"Cuando empieza el mes, tus socios vuelven a tener todo disponible. Lo usado queda en el historial.",
		duration: 6500,
		Scene: RenewScene,
	},
];

export function HowItWorks() {
	const screen = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const [replay, setReplay] = useState(0);
	const progress = useRef<HTMLSpanElement>(null);
	const inView = useInView(screen);
	const reduced = usePrefersReducedMotion();

	// Advance through the steps while the phone is visible. The bar is written
	// straight to the DOM so the scenes do not re-render every frame.
	// biome-ignore lint/correctness/useExhaustiveDependencies: `replay` restarts the timer when a step is clicked again.
	useEffect(() => {
		if (reduced || !inView) return;
		let elapsed = 0;
		let previous = performance.now();
		let frame = requestAnimationFrame(function tick(now) {
			elapsed += now - previous;
			previous = now;
			const ratio = Math.min(1, elapsed / steps[active].duration);
			if (progress.current)
				progress.current.style.transform = `scaleX(${ratio})`;
			if (ratio < 1) frame = requestAnimationFrame(tick);
			else setActive((index) => (index + 1) % steps.length);
		});
		return () => cancelAnimationFrame(frame);
	}, [active, inView, reduced, replay]);

	const select = (index: number) => {
		setActive(index);
		setReplay((n) => n + 1);
	};

	const { Scene } = steps[active];

	return (
		<section id="como-funciona" className="mx-auto max-w-6xl px-4 md:px-6">
			<div className="grid items-center gap-12 rounded-[2.25rem] bg-olive px-5 py-12 md:px-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20 lg:px-16 lg:py-20">
				<div className="v-stack gap-8">
					<SectionHeading
						kicker="Cómo funciona"
						title="Todo pasa en el celular."
					/>
					<ol className="v-stack gap-1">
						{steps.map((step, index) => {
							const on = index === active;
							return (
								<li key={step.title}>
									<button
										type="button"
										aria-pressed={on}
										onClick={() => select(index)}
										className={cn(
											"relative grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 rounded-3xl p-4 text-left transition-colors duration-300",
											on
												? "bg-white shadow-[0_10px_24px_-18px_rgb(40_50_20/0.5)]"
												: "hover:bg-white/45",
										)}
									>
										<span
											className={cn(
												"center size-13 rounded-2xl text-brand-600 transition-colors",
												on ? "bg-brand-50" : "bg-white/70",
											)}
										>
											<Icon
												name={step.icon}
												className="size-6.5 stroke-[1.5]"
											/>
										</span>
										<span className="v-stack">
											{/* Same height as the icon so the title never shifts when the text opens. */}
											<span className="h-stack min-h-13 items-center font-semibold text-xl leading-snug tracking-tight">
												{step.title}
											</span>
											<span
												className={cn(
													"grid transition-[grid-template-rows] duration-500 ease-out-soft",
													on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
												)}
											>
												<span className="overflow-hidden">
													<span className="block pb-4 text-ink-soft">
														{step.description}
													</span>
												</span>
											</span>
										</span>
										{on && !reduced && (
											<span className="absolute right-6 bottom-3 left-21 h-0.5 overflow-hidden rounded-full bg-sand-100">
												<span
													ref={progress}
													className="block h-full origin-left scale-x-0 bg-brand-600"
												/>
											</span>
										)}
									</button>
								</li>
							);
						})}
					</ol>
				</div>

				<div className="v-stack items-center gap-3">
					<HandNote arrow="down-left" className="self-end">
						Así se ve de verdad
					</HandNote>
					<Phone
						ref={screen}
						label={`Pantalla del paso: ${steps[active].title}`}
					>
						<Scene key={`${active}-${replay}`} screen={screen} />
					</Phone>
				</div>
			</div>
		</section>
	);
}
