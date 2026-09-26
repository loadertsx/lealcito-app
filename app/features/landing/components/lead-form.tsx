import { useId } from "react";
import { useFetcher } from "react-router";
import { type ClassNameRecord, cn } from "~/shared/lib/cn";
import {
	businessKinds,
	honeypotField,
	type LeadField,
	type LeadResult,
} from "../lead";

export function LeadSection() {
	return (
		<section
			id="sumate"
			className="mx-auto max-w-6xl scroll-mt-6 px-4 pb-20 md:px-6 md:pb-28"
		>
			<div className="grid gap-12 rounded-[2.25rem] bg-brand-50 px-5 py-12 md:px-12 md:py-16 lg:grid-cols-2 lg:px-16 lg:py-20">
				<div className="v-stack gap-5">
					<h2 className="text-balance font-bold text-4xl leading-[1.08] tracking-tight md:text-5xl">
						¿Querés sumar tu negocio?
					</h2>
					<p className="max-w-md text-ink-soft text-lg">
						Estamos abriendo lugares de a poco para acompañar bien a cada
						negocio que arranca. Dejanos tus datos y te escribimos para armar
						juntos tus membresías.
					</p>
					<StoreDrawing />
				</div>
				<LeadForm />
			</div>
		</section>
	);
}

function LeadForm() {
	const fetcher = useFetcher<LeadResult>();
	const result = fetcher.data;
	const errors = result?.status === "invalid" ? result.errors : {};
	const busy = fetcher.state !== "idle";

	if (result?.status === "sent") {
		return (
			<div
				className="v-stack animate-value-in gap-2 self-start rounded-3xl bg-white p-7"
				role="status"
			>
				<h3 className="font-semibold text-2xl tracking-tight">
					¡Gracias{result.name ? `, ${result.name}` : ""}!
				</h3>
				<p className="text-ink-soft">
					{result.email
						? `Te vamos a escribir a ${result.email} en los próximos días.`
						: "Te vamos a escribir en los próximos días."}
				</p>
			</div>
		);
	}

	return (
		<fetcher.Form
			method="post"
			action="/?index"
			noValidate
			className="v-stack gap-4"
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<Field
					name="name"
					label="Tu nombre"
					autoComplete="name"
					placeholder="Lucía Paredes"
					error={errors.name}
				/>
				<Field
					name="email"
					label="Email"
					type="email"
					autoComplete="email"
					placeholder="vos@tunegocio.com"
					error={errors.email}
				/>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<Field
					name="business"
					label="Tu negocio"
					autoComplete="organization"
					placeholder="Casa Ferrer"
					error={errors.business}
				/>
				<Field
					name="kind"
					label="Rubro"
					error={errors.kind}
					select={businessKinds}
				/>
			</div>
			{/* Honeypot: hidden from people, tempting for bots. */}
			<input
				type="text"
				name={honeypotField}
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
				className="sr-only"
			/>
			<div className="v-stack items-start gap-3 pt-1">
				<button type="submit" className="ui-button" disabled={busy}>
					{busy ? "Enviando…" : "Quiero sumar mi negocio"}
				</button>
				<p
					className={cn(
						"text-sm",
						result?.status === "failed"
							? "font-semibold text-danger"
							: "text-muted",
					)}
				>
					{result?.status === "failed"
						? "No pudimos enviar tus datos. Probá de nuevo en unos minutos."
						: "Te escribimos solo para esto. Nada de newsletters."}
				</p>
			</div>
		</fetcher.Form>
	);
}

type FieldProps = {
	name: LeadField;
	label: string;
	error?: string;
	type?: string;
	autoComplete?: string;
	placeholder?: string;
	select?: readonly string[];
	className?: ClassNameRecord<"root" | "control">;
};

function Field({
	name,
	label,
	error,
	type = "text",
	autoComplete,
	placeholder,
	select,
	className,
}: FieldProps) {
	const id = useId();
	const errorId = `${id}-error`;
	const shared = {
		id,
		name,
		"aria-invalid": error ? true : undefined,
		"aria-describedby": error ? errorId : undefined,
		className: cn("ui-input", className?.control),
	};

	return (
		<div className={cn("v-stack gap-1.5", className?.root)}>
			<label htmlFor={id} className="font-semibold text-sm">
				{label}
			</label>
			{select ? (
				<select {...shared} defaultValue={select[0]}>
					{select.map((option) => (
						<option key={option}>{option}</option>
					))}
				</select>
			) : (
				<input
					{...shared}
					type={type}
					autoComplete={autoComplete}
					placeholder={placeholder}
				/>
			)}
			{error && (
				<p id={errorId} className="font-medium text-danger text-sm">
					{error}
				</p>
			)}
		</div>
	);
}

/** Line drawing of a storefront, in the same stroke style as the icons. */
function StoreDrawing() {
	return (
		<svg
			viewBox="0 0 180 130"
			aria-hidden="true"
			className="mt-2 h-32 w-44 fill-none stroke-brand-400 stroke-2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M20 50l14-32h112l14 32" />
			<path d="M20 50c0 9 8 15 17.5 15S55 59 55 50c0 9 8 15 17.5 15S90 59 90 50c0 9 8 15 17.5 15S125 59 125 50c0 9 8 15 17.5 15S160 59 160 50" />
			<path d="M28 70v50h124V70M44 120V86h30v34M100 96h28M8 120h164M70 34h40" />
			<rect x="92" y="84" width="44" height="24" rx="3" />
		</svg>
	);
}
