import type { ReactNode } from "react";
import { type ClassNameRecord, cn } from "~/shared/lib/cn";

type SectionHeadingProps = {
	kicker: string;
	title: ReactNode;
	children?: ReactNode;
	className?: ClassNameRecord<"root" | "title">;
};

/** Kicker, title and optional lede shared by every landing section. */
export function SectionHeading({
	kicker,
	title,
	children,
	className,
}: SectionHeadingProps) {
	return (
		<div className={cn("v-stack max-w-3xl gap-4", className?.root)}>
			<p className="ui-kicker">{kicker}</p>
			<h2
				className={cn(
					"text-balance font-bold text-4xl leading-[1.08] tracking-tight md:text-5xl",
					className?.title,
				)}
			>
				{title}
			</h2>
			{children && (
				<p className="text-ink-soft text-lg md:text-xl">{children}</p>
			)}
		</div>
	);
}
