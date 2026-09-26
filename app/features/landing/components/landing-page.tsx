import { Audiences } from "./audiences";
import { Explainer } from "./explainer";
import { Faq } from "./faq";
import { FeaturePills } from "./feature-pills";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { LogoMark } from "./icon";
import { LeadSection } from "./lead-form";
import { LeftOut } from "./left-out";

const links = [
	{ href: "#que-es", label: "Qué es" },
	{ href: "#como-funciona", label: "Cómo funciona" },
	{ href: "#preguntas", label: "Preguntas" },
];

export function LandingPage() {
	return (
		<>
			<header className="bg-white">
				<nav
					aria-label="Principal"
					className="mx-auto h-stack max-w-6xl items-center justify-between gap-4 px-4 py-4.5 md:px-6"
				>
					<a
						href="/"
						className="h-stack items-center gap-2 font-bold text-[22px] tracking-tight"
					>
						<LogoMark />
						lealcito
					</a>
					<ul className="h-stack gap-7 font-medium text-muted max-md:hidden">
						{links.map((link) => (
							<li key={link.href}>
								<a href={link.href} className="hover:text-ink">
									{link.label}
								</a>
							</li>
						))}
					</ul>
					<a href="#sumate" className="ui-button px-4 py-2.5 text-sm">
						Sumá tu negocio
					</a>
				</nav>
			</header>
			<main>
				<Hero />
				<FeaturePills />
				<Explainer />
				<HowItWorks />
				<Audiences />
				<LeftOut />
				<Faq />
				<LeadSection />
			</main>
			<footer className="mx-auto h-stack max-w-6xl flex-wrap justify-between gap-4 px-4 pb-14 text-muted text-sm md:px-6">
				<span className="font-bold text-ink text-lg tracking-tight">
					lealcito
				</span>
				<span>Hecho en Argentina · © {new Date().getFullYear()}</span>
			</footer>
		</>
	);
}
