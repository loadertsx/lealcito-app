import { type ReactNode, type RefObject, useRef, useState } from "react";
import { cn } from "~/shared/lib/cn";
import { Icon, type IconName } from "./icon";
import { FakeButton, FakeInput } from "./phone";
import { typeInto, useScene } from "./use-scene";

/*
 * Each scene acts out one "Cómo funciona" step inside the phone. A scene plays
 * once when mounted; the parent remounts it to replay. With reduced motion the
 * scene shows its final state instead.
 */
type SceneProps = { screen: RefObject<HTMLDivElement | null> };

const monthName = (offset: number) =>
	new Date(
		new Date().getFullYear(),
		new Date().getMonth() + offset,
		1,
	).toLocaleDateString("es-AR", { month: "long" });

function SceneLayout({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn("v-stack animate-value-in gap-2.5 px-4.5 pt-2", className)}
		>
			{children}
		</div>
	);
}

function SceneTitle({
	children,
	align = "center",
}: {
	children: ReactNode;
	align?: "center" | "left";
}) {
	return (
		<h3
			className={cn(
				"font-semibold text-2xl leading-tight tracking-tight",
				align === "center" && "text-center",
			)}
		>
			{children}
		</h3>
	);
}

/* ---------- 1. Build memberships ---------- */

const tiers: { name: string; tone: string; perks: string }[] = [
	{
		name: "Silver",
		tone: "bg-silver-soft text-silver-ink",
		perks: "Café · 10% en tienda",
	},
	{
		name: "Gold",
		tone: "bg-gold-soft text-gold-ink",
		perks: "Café · 15% en tienda",
	},
	{
		name: "Black",
		tone: "bg-ink text-white",
		perks: "Café · Copa de vino · Mesa",
	},
];

export function BuilderScene({ screen }: SceneProps) {
	const [typed, setTyped] = useState("");
	const [focused, setFocused] = useState(false);
	const [pressed, setPressed] = useState(false);
	const [added, setAdded] = useState(false);

	const reduced = useScene(
		screen,
		async (wait) => {
			await wait(800);
			setFocused(true);
			await typeInto("Postre de la casa", setTyped, wait);
			await wait(300);
			setPressed(true);
			await wait(170);
			setPressed(false);
			setTyped("");
			setFocused(false);
			setAdded(true);
		},
		{ once: true },
	);
	const showAdded = added || reduced;

	return (
		<SceneLayout>
			<span className="circle center size-9 bg-white shadow-sm">
				<Icon name="close" className="size-4 stroke-2" />
			</span>
			<SceneTitle>Tus membresías</SceneTitle>
			<p className="text-center text-ink-soft text-xs">
				Hasta tres niveles para Casa Ferrer.
			</p>
			<ul className="v-stack gap-2">
				{tiers.map((tier) => {
					const isGold = tier.name === "Gold";
					return (
						<li
							key={tier.name}
							className={cn(
								"h-stack items-center gap-3 rounded-2xl border border-sand-200 bg-white px-3 py-2.5",
								isGold && showAdded && "animate-flash",
							)}
						>
							<span className={cn("circle center size-9", tier.tone)}>
								<Icon name="card" className="size-4.5" />
							</span>
							<span className="v-stack min-w-0">
								<span className="font-semibold">{tier.name}</span>
								<span className="truncate text-ink-soft text-xs">
									{isGold && showAdded
										? "Café · Postre · 15% en tienda"
										: tier.perks}
								</span>
							</span>
						</li>
					);
				})}
			</ul>
			<span className="pt-1 font-semibold text-muted text-xs">
				Nuevo beneficio para Gold
			</span>
			<FakeInput
				value={typed}
				placeholder="Ej: postre de la casa"
				focused={focused}
			/>
			<FakeButton pressed={pressed}>Agregar a Gold</FakeButton>
		</SceneLayout>
	);
}

/* ---------- 2. Join with an email link ---------- */

export function EmailScene({ screen }: SceneProps) {
	const [typed, setTyped] = useState("");
	const [focused, setFocused] = useState(false);
	const [pressed, setPressed] = useState(false);
	const [sent, setSent] = useState(false);
	const [notice, setNotice] = useState<"hidden" | "shown" | "pressed">(
		"hidden",
	);
	const [welcome, setWelcome] = useState(false);

	const reduced = useScene(
		screen,
		async (wait) => {
			await wait(700);
			setFocused(true);
			await typeInto("lucia@ejemplo.com", setTyped, wait, 55);
			await wait(250);
			setPressed(true);
			await wait(170);
			setPressed(false);
			setFocused(false);
			setSent(true);
			await wait(1000);
			setNotice("shown");
			await wait(1500);
			setNotice("pressed");
			await wait(180);
			setNotice("hidden");
			setWelcome(true);
		},
		{ once: true },
	);

	return (
		<SceneLayout className="relative grow">
			<span className="circle center mx-auto mt-2 size-14 bg-brand-100 font-bold text-brand-700">
				CF
			</span>
			<SceneTitle>Hacete socio de Casa Ferrer</SceneTitle>
			<p className="text-center text-ink-soft text-xs">
				Te mandamos un enlace para entrar. Sin contraseña.
			</p>
			<FakeInput
				value={typed}
				placeholder="tu@email.com"
				focused={focused}
				icon="mail"
			/>
			<FakeButton pressed={pressed}>Enviarme el enlace</FakeButton>
			<p
				className={cn(
					"text-center font-semibold text-brand-700 text-xs transition-opacity",
					sent ? "opacity-100" : "opacity-0",
				)}
			>
				Listo. Revisá tu email.
			</p>

			<div
				className={cn(
					"absolute inset-x-2.5 -top-2 z-10 grid grid-cols-[auto_1fr] items-center gap-2.5 rounded-3xl bg-white/95 p-3 shadow-xl",
					"transition duration-500 ease-bounce",
					notice === "hidden" ? "-translate-y-[130%]" : "translate-y-0",
					notice === "pressed" && "scale-95",
				)}
			>
				<span className="center size-8.5 rounded-lg bg-brand-600 text-white">
					<Icon name="check" className="size-5" />
				</span>
				<span className="v-stack">
					<span className="h-stack justify-between text-[11px] text-muted">
						<b className="text-ink tracking-wide">LEALCITO</b>ahora
					</span>
					<span className="font-semibold text-xs">
						Tu enlace para entrar a Casa Ferrer
					</span>
				</span>
			</div>

			{(welcome || reduced) && (
				<div className="absolute inset-0 z-5 v-stack animate-value-in items-center justify-center gap-2.5 bg-paper text-center">
					<span className="circle center size-16 animate-pop bg-linear-to-b from-brand-500 to-brand-600 text-white">
						<svg
							viewBox="0 0 28 28"
							aria-hidden="true"
							className="size-7.5 fill-none stroke-current stroke-3"
						>
							<path
								d="M7 14.5l4.6 4.6 9.4-10"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
					<span className="font-semibold text-xl tracking-tight">
						Hola, Lucía
					</span>
					<span className="text-ink-soft">Ya sos parte de Casa Ferrer.</span>
				</div>
			)}
		</SceneLayout>
	);
}

/* ---------- 3. Redeem at the counter ---------- */

export function CounterScene({ screen }: SceneProps) {
	const button = useRef<HTMLSpanElement>(null);
	const [query, setQuery] = useState("");
	const [focused, setFocused] = useState(false);
	const [found, setFound] = useState(false);
	const [used, setUsed] = useState(false);
	const [pressed, setPressed] = useState(false);
	const [refused, setRefused] = useState(0);
	const [finger, setFinger] = useState<{
		x: number;
		y: number;
		visible: boolean;
	}>({
		x: 210,
		y: 520,
		visible: false,
	});
	const [time] = useState(() =>
		new Date().toLocaleTimeString("es-AR", {
			hour: "2-digit",
			minute: "2-digit",
		}),
	);

	const reduced = useScene(
		screen,
		async (wait) => {
			const tap = async () => {
				const from = screen.current?.getBoundingClientRect();
				const to = button.current?.getBoundingClientRect();
				if (from && to) {
					setFinger({
						x: to.left - from.left + to.width / 2,
						y: to.top - from.top + to.height / 2,
						visible: true,
					});
				}
				await wait(750);
				setPressed(true);
				await wait(170);
				setPressed(false);
			};

			await wait(600);
			setFocused(true);
			await typeInto("lucí", setQuery, wait, 110);
			await wait(300);
			setFocused(false);
			setFound(true);
			await wait(900);
			await tap();
			setUsed(true);
			await wait(1500);
			await tap();
			setRefused(1);
			await wait(1400);
			setFinger((f) => ({ ...f, visible: false }));
		},
		{ once: true },
	);
	const isUsed = used || reduced;

	return (
		<SceneLayout>
			<div className="h-stack items-center justify-between">
				<SceneTitle align="left">Mostrador</SceneTitle>
				<span className="ui-chip bg-staff-soft text-staff-ink">
					Martín · staff
				</span>
			</div>
			<FakeInput
				value={query}
				placeholder="Buscar socio"
				focused={focused}
				icon="search"
			/>
			<div
				className={cn(
					"v-stack gap-2 transition duration-300 ease-out-soft",
					found || reduced
						? "translate-y-0 opacity-100"
						: "translate-y-1.5 opacity-0",
				)}
			>
				<div className="h-stack items-center gap-2.5 rounded-2xl border border-sand-200 bg-white px-3 py-2.5">
					<span className="circle center size-9 bg-rose-soft font-bold text-rose-ink text-xs">
						LP
					</span>
					<span className="v-stack items-start">
						<span className="font-semibold">Lucía Paredes</span>
						<span className="ui-chip bg-gold-soft text-gold-ink">Gold</span>
					</span>
				</div>
				<div
					key={refused}
					className={cn(
						"h-stack items-center gap-2.5 rounded-2xl border border-sand-200 py-2.5 pr-2.5 pl-3 transition-colors",
						isUsed ? "bg-sand-100" : "bg-white",
						refused > 0 && "animate-shake",
					)}
				>
					<span className="v-stack min-w-0 grow">
						<span className="font-semibold">Café de especialidad</span>
						<span className="text-ink-soft text-xs">
							{isUsed ? `Usado hoy, ${time} · Martín` : "Disponible este mes"}
						</span>
					</span>
					<span ref={button}>
						<FakeButton size="sm" off={isUsed} pressed={pressed}>
							{isUsed ? "Usado" : "Usar"}
						</FakeButton>
					</span>
				</div>
				<div className="h-stack items-center gap-2.5 rounded-2xl border border-sand-200 bg-white py-2.5 pr-2.5 pl-3">
					<span className="v-stack min-w-0 grow">
						<span className="font-semibold">Postre de la casa</span>
						<span className="text-ink-soft text-xs">Disponible este mes</span>
					</span>
					<FakeButton size="sm">Usar</FakeButton>
				</div>
				<p
					className={cn(
						"rounded-xl bg-danger-soft px-3 py-2 font-semibold text-danger text-xs transition-opacity",
						refused > 0 ? "opacity-100" : "opacity-0",
					)}
				>
					Este beneficio ya se usó este mes.
				</p>
			</div>
			<span
				aria-hidden="true"
				className={cn(
					"-mt-3.75 -ml-3.75 pointer-events-none absolute top-0 left-0 z-20 size-7.5 rounded-full border-2 border-ink/50 bg-ink/15",
					"transition-[translate,opacity] duration-700 ease-in-out",
					finger.visible ? "opacity-100" : "opacity-0",
					pressed && "scale-75",
				)}
				style={{ translate: `${finger.x}px ${finger.y}px` }}
			/>
		</SceneLayout>
	);
}

/* ---------- 4. Monthly renewal ---------- */

const renewPerks: { icon: IconName; title: string; usedAtStart: boolean }[] = [
	{ icon: "cup", title: "Café de especialidad", usedAtStart: true },
	{ icon: "cake", title: "Postre de la casa", usedAtStart: false },
	{ icon: "tag", title: "15% en tienda", usedAtStart: true },
];

export function RenewScene({ screen }: SceneProps) {
	const [phase, setPhase] = useState<"ending" | "last-day" | "renewed">(
		"ending",
	);
	const reduced = useScene(
		screen,
		async (wait) => {
			await wait(1000);
			setPhase("last-day");
			await wait(1500);
			setPhase("renewed");
		},
		{ once: true },
	);
	const current = reduced ? "renewed" : phase;
	const renewed = current === "renewed";

	return (
		<SceneLayout>
			<SceneTitle align="left">
				Beneficios de{" "}
				<span key={String(renewed)} className="inline-block animate-value-in">
					{monthName(renewed ? 1 : 0)}
				</span>
			</SceneTitle>
			<p className="text-ink-soft text-xs">
				{
					{
						ending: "Quedan 3 días",
						"last-day": "Último día",
						renewed: "Quedan 30 días",
					}[current]
				}
			</p>
			<div className="h-2 overflow-hidden rounded-full border border-sand-200 bg-white">
				<div
					className={cn(
						"h-full rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-[width] duration-700 ease-out-soft",
						{
							"w-[90%]": current === "ending",
							"w-full": current === "last-day",
							"w-[4%]": renewed,
						},
					)}
				/>
			</div>
			<ul className="v-stack gap-2 pt-1">
				{renewPerks.map((perk) => {
					const used = perk.usedAtStart && !renewed;
					return (
						<li
							key={`${perk.title}-${renewed}`}
							className={cn(
								"h-stack items-center gap-3 rounded-2xl border p-2.5",
								used
									? "border-transparent bg-sand-100"
									: "border-sand-200 bg-white",
								renewed && "animate-flash",
							)}
						>
							<span className="circle center size-9 bg-brand-50 text-brand-600">
								<Icon name={perk.icon} className="size-4.5" />
							</span>
							<span className="grow font-semibold">{perk.title}</span>
							<span
								className={cn(
									"font-semibold text-xs",
									used ? "text-muted" : "text-brand-700",
								)}
							>
								{used ? "Usado" : "Disponible"}
							</span>
						</li>
					);
				})}
			</ul>
			{renewed && (
				<span className="ui-chip animate-pop self-start bg-brand-50 text-brand-700">
					Beneficios nuevos
				</span>
			)}
		</SceneLayout>
	);
}
