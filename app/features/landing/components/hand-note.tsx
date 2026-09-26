import type { ReactNode } from "react";
import { type ClassName, cn } from "~/shared/lib/cn";

const arrows = {
	"down-right": ["M3 10C22 4 42 12 50 34", "M42 29l8 8 4-11"],
	"down-left": ["M53 10C34 4 14 12 6 34", "M14 29l-8 8-4-11"],
} as const;

type HandNoteProps = {
	children: ReactNode;
	arrow?: keyof typeof arrows;
	className?: ClassName;
};

/** A handwritten annotation with a drawn arrow pointing at a product screen. */
export function HandNote({ children, arrow, className }: HandNoteProps) {
	const drawn = arrow && (
		<svg
			viewBox="0 0 56 46"
			aria-hidden="true"
			className="h-11.5 w-14 shrink-0 translate-y-3 overflow-visible fill-none stroke-ink"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{arrows[arrow].map((d) => (
				<path key={d} d={d} strokeDasharray="120" className="animate-draw" />
			))}
		</svg>
	);

	return (
		<p
			className={cn(
				"h-stack items-start gap-1 font-hand text-lg text-ink leading-tight",
				className,
			)}
		>
			{arrow === "down-left" && drawn}
			<span className="max-w-[11em]">{children}</span>
			{arrow === "down-right" && drawn}
		</p>
	);
}
