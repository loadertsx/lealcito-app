import { SectionHeading } from "./section";

const questions = [
	{
		q: "¿Mis clientes tienen que descargar algo?",
		a: "No. Entran desde el navegador del celular con su email. Reciben un enlace, lo tocan y quedan con la sesión iniciada.",
	},
	{
		q: "¿Qué pasa con los beneficios que no se usan?",
		a: "Vencen cuando termina el mes y al mes siguiente llegan los nuevos. El historial queda guardado.",
	},
	{
		q: "¿Puedo cambiar los beneficios?",
		a: "Sí, cuando quieras. Lo que tus socios ya recibieron ese mes no cambia.",
	},
	{
		q: "¿Quién puede canjear?",
		a: "Vos y las personas de tu equipo con acceso a tu negocio. Cada canje queda registrado con su nombre.",
	},
	{
		q: "¿Sirve si tengo más de un local?",
		a: "Cada negocio tiene su propia página, sus membresías y su equipo. Tus socios usan la misma cuenta en todos.",
	},
	{
		q: "¿Cuánto cuesta?",
		a: "Todavía estamos definiendo los planes. Quienes se sumen ahora los van a conocer primero.",
	},
];

export function Faq() {
	return (
		<section
			id="preguntas"
			className="mx-auto v-stack max-w-6xl gap-12 px-4 pb-20 md:px-6 md:pb-32"
		>
			<SectionHeading
				kicker="Preguntas"
				title="Lo que nos preguntan seguido."
			/>
			<dl className="grid gap-x-14 gap-y-10 md:grid-cols-2">
				{questions.map(({ q, a }) => (
					<div key={q} className="v-stack gap-2">
						<dt className="font-semibold text-xl tracking-tight">{q}</dt>
						<dd className="text-ink-soft">{a}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
