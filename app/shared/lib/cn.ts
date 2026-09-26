import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export type ClassName = ClassValue;
export type ClassNameRecord<Key extends string> = { [K in Key]?: ClassName };

// Teach tailwind-merge the custom stack utilities so `h-stack` and a later
// `v-stack` resolve like `flex-row`/`flex-col` instead of both applying.
const twMerge = extendTailwindMerge<"stack">({
	extend: {
		classGroups: {
			stack: ["v-stack", "v-stack-reverse", "h-stack", "h-stack-reverse"],
		},
	},
});

/** Merges class names; later Tailwind classes win, so pass `className` last. */
export function cn(...classes: ClassName[]): string {
	return twMerge(clsx(...classes));
}
