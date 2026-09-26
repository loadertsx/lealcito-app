import { useRef, useState } from "react";
import { cn } from "~/shared/lib/cn";
import { HandNote } from "./hand-note";
import { Icon, type IconName } from "./icon";
import { FakeButton, Phone } from "./phone";
import { useScene } from "./use-scene";

const perks: { icon: IconName; title: string; detail: string }[] = [
	{ icon: "cup", title: "Café de especialidad", detail: "1 por mes" },
	{ icon: "cake", title: "Postre de la casa", detail: "1 por mes" },
	{ icon: "tag", title: "15% en tienda", detail: "1 por mes" },
];

const monthName = (month: number) => {
	const name = new Date(2026, month, 1).toLocaleDateString("es-AR", {
		month: "long",
	});
	return name[0].toUpperCase() + name.slice(1);
};

export function Hero() {
	return (
		<section className="border-sand-200 border-b bg-linear-to-b from-white to-paper">
			<div className="mx-auto grid max-w-6xl items-end gap-10 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
				<div className="v-stack gap-6 self-center pt-6 lg:pt-0 lg:pb-16">
					<h1 className="text-balance font-bold text-5xl leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
						Que tus mejores clientes <span className="ui-mark">vuelvan</span>{" "}
						todos los meses.
					</h1>
					<p className="max-w-xl text-lg text-ink-soft md:text-xl">
						Lealcito es la forma simple de tener socios. Armás hasta tres
						membresías, tus clientes se suman con su email y cada mes reciben
						beneficios nuevos. Tu equipo los canjea con un toque.
					</p>
					<div className="h-stack flex-wrap items-center gap-3 pt-2">
						<a className="ui-button" href="#sumate">
							Quiero sumar mi negocio
						</a>
						<a className="ui-button-soft" href="#como-funciona">
							Ver cómo funciona
						</a>
					</div>
					<p className="text-muted text-sm">
						Estamos sumando negocios de a poco.
					</p>
				</div>

				<div className="v-stack items-center gap-2">
					<HandNote arrow="down-right" className="self-start lg:-ml-10">
						Esto ve tu cliente en su celular
					</HandNote>
					{/* The phone is cropped by the section edge on purpose. */}
					<div className="h-[500px] overflow-hidden md:h-[540px]">
						<CustomerPhone />
					</div>
				</div>
			</div>
		</section>
	);
}

function CustomerPhone() {
	const screen = useRef<HTMLDivElement>(null);
	const [month, setMonth] = useState(() => new Date().getMonth());
	const [used, setUsed] = useState<number[]>([]);
	const [pressed, setPressed] = useState(false);
	const [toast, setToast] = useState(false);
	const [renewed, setRenewed] = useState(false);

	useScene(screen, async (wait) => {
		setUsed([]);
		await wait(1800);
		setPressed(true);
		await wait(170);
		setPressed(false);
		setUsed([0]);
		setToast(true);
		await wait(2300);
		setToast(false);
		await wait(1200);
		setPressed(true);
		await wait(170);
		setPressed(false);
		setUsed([0, 2]);
		await wait(2200);
		setMonth((m) => (m + 1) % 12);
		setUsed([]);
		setRenewed(true);
		await wait(2600);
		setRenewed(false);
		await wait(400);
	});

	const available = perks.length - used.length;

	return (
		<Phone
			ref={screen}
			label="Celular de una socia de Casa Ferrer con sus beneficios del mes"
		>
			<div
				className={cn(
					"absolute inset-x-3 top-12 z-10 h-stack items-center gap-2 rounded-2xl bg-ink px-3.5 py-2.5 font-semibold text-white text-xs",
					"transition duration-500 ease-bounce",
					toast ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0",
				)}
			>
				<span className="circle size-2 bg-brand-400" />
				Café canjeado en el mostrador
			</div>

			<div className="v-stack gap-5 px-4 pt-3">
				<div className="h-stack items-center justify-between">
					<div className="h-stack items-center gap-2.5">
						<span className="circle center size-10 bg-brand-100 font-bold text-brand-700 text-xs">
							LP
						</span>
						<span className="v-stack items-start gap-0.5">
							<span className="font-semibold text-[11px] text-ink-soft uppercase tracking-wider">
								Casa Ferrer
							</span>
							<span className="ui-chip bg-gold-soft text-gold-ink">
								Socia Gold
							</span>
						</span>
					</div>
					<span className="circle center size-9 bg-white shadow-sm">
						<Icon name="bell" className="size-4.5" />
					</span>
				</div>

				<div className="v-stack gap-1">
					<div className="h-stack items-end gap-2.5">
						<span
							key={available}
							className="animate-value-in font-bold text-6xl tabular-nums leading-none tracking-tight"
						>
							{available}
						</span>
						<span className="pb-1 font-medium text-ink-soft text-sm leading-tight">
							beneficios
							<br />
							disponibles
						</span>
					</div>
					<span className="text-muted text-xs">
						Se renuevan todos los meses
					</span>
				</div>

				<FakeButton pressed={pressed}>Usar un beneficio</FakeButton>

				<div className="v-stack gap-2.5">
					<div className="h-stack items-center justify-between">
						<span className="h-stack items-center gap-2">
							<span
								key={month}
								className="animate-value-in font-semibold text-base"
							>
								{monthName(month)}
							</span>
							{renewed && (
								<span className="ui-chip animate-pop bg-brand-50 text-brand-700">
									Nuevos
								</span>
							)}
						</span>
						<span className="font-semibold text-brand-600 text-xs">
							Historial
						</span>
					</div>
					<ul className="v-stack gap-2">
						{perks.map((perk, index) => (
							<PerkRow key={perk.title} {...perk} used={used.includes(index)} />
						))}
					</ul>
				</div>
			</div>
		</Phone>
	);
}

type PerkRowProps = {
	icon: IconName;
	title: string;
	detail: string;
	used: boolean;
};

function PerkRow({ icon, title, detail, used }: PerkRowProps) {
	return (
		<li
			className={cn(
				"h-stack items-center gap-3 rounded-2xl border p-2.5 transition-colors duration-300",
				used ? "border-transparent bg-sand-100" : "border-sand-200 bg-white",
			)}
		>
			<span className="circle center size-9 bg-brand-50 text-brand-600">
				<Icon name={icon} className="size-4.5" />
			</span>
			<span className="v-stack min-w-0 grow">
				<span
					className={cn("font-semibold leading-tight", used && "text-muted")}
				>
					{title}
				</span>
				<span className="text-xs">
					<span
						className={cn(
							"font-semibold",
							used ? "text-muted" : "text-brand-700",
						)}
					>
						{used ? "Usado hoy" : "Disponible"}
					</span>
					<span className="text-muted"> · {detail}</span>
				</span>
			</span>
			{/* The state is also in the text above; the mark is a visual cue. */}
			{used ? (
				<span className="circle center size-5.5 animate-pop bg-brand-600 text-white">
					<svg
						viewBox="0 0 10 10"
						aria-hidden="true"
						className="size-3 fill-none stroke-current stroke-[1.8]"
					>
						<path
							d="M2 5.2l2 2 4-4.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			) : (
				<span className="circle size-5.5 border-2 border-brand-100" />
			)}
		</li>
	);
}
