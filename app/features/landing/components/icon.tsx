import type { ReactNode } from "react";
import { type ClassName, cn } from "~/shared/lib/cn";

// Thin line icons drawn on a 24px grid; stroke comes from `currentColor`.
const paths = {
	cup: (
		<>
			<path d="M5 10h11v4.5A4.5 4.5 0 0 1 11.5 19h-2A4.5 4.5 0 0 1 5 14.5z" />
			<path d="M16 11.5h1.5a2.25 2.25 0 0 1 0 4.5H16" />
			<path d="M9 4.5c-.8 1 .8 1.8 0 3M12.5 4.5c-.8 1 .8 1.8 0 3M4 21.5h14" />
		</>
	),
	cake: (
		<>
			<path d="M4 20.5h16M5.5 20.5v-7h13v7" />
			<path d="M5.5 16c2 1.2 3.4-1.2 5.3 0s3.4-1.2 5.3 0 2.4.4 2.4.4" />
			<path d="M9 13.5V10M15 13.5V10M9 7.5v.1M15 7.5v.1" />
		</>
	),
	tag: (
		<>
			<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z" />
			<circle cx="8" cy="8" r="1.4" />
		</>
	),
	card: (
		<>
			<rect x="3" y="6" width="18" height="12.5" rx="2.5" />
			<path d="M3 10.2h18M6.5 15h4" />
		</>
	),
	mail: (
		<>
			<rect x="3" y="5.5" width="18" height="13" rx="2.5" />
			<path d="M4 7.5l8 6 8-6" />
		</>
	),
	check: (
		<>
			<circle cx="12" cy="12" r="8.5" />
			<path d="M8.2 12.3l2.6 2.6 5-5.4" />
		</>
	),
	calendar: (
		<>
			<rect x="3.5" y="5" width="17" height="15" rx="2.5" />
			<path d="M3.5 9.5h17M8 3v4M16 3v4" />
			<path d="M9.3 15.2a2.8 2.8 0 1 0 .8-2.3M9.6 11.6l.5 1.4 1.4-.4" />
		</>
	),
	store: (
		<>
			<path d="M4 9.5l1.5-4.5h13L20 9.5" />
			<path d="M4 9.5a2.67 2.67 0 0 0 5.33 0 2.67 2.67 0 0 0 5.34 0 2.67 2.67 0 0 0 5.33 0" />
			<path d="M5.5 12v7.5h13V12M10 19.5v-4h4v4" />
		</>
	),
	users: (
		<>
			<circle cx="9" cy="8.5" r="3" />
			<path d="M3.5 18.5a5.5 5.5 0 0 1 11 0" />
			<circle cx="16.5" cy="9" r="2.5" />
			<path d="M15.5 13.8a4.5 4.5 0 0 1 5 4.7" />
		</>
	),
	phone: (
		<>
			<rect x="7" y="3" width="10" height="18" rx="2.5" />
			<path d="M11 18h2" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="8.5" />
			<path d="M12 7.5V12l3 2" />
		</>
	),
	shield: (
		<>
			<path d="M12 3.5l7 2.8v5.2c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6.3z" />
			<path d="M9 12l2.2 2.2L15.5 10" />
		</>
	),
	close: <path d="M7 7l10 10M17 7L7 17" />,
	search: (
		<>
			<circle cx="11" cy="11" r="6" />
			<path d="M15.5 15.5L20 20" />
		</>
	),
	bell: (
		<>
			<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z" />
			<path d="M10 20.5a2 2 0 0 0 4 0" />
		</>
	),
	qr: (
		<>
			<rect x="4" y="4" width="6" height="6" rx="1" />
			<rect x="14" y="4" width="6" height="6" rx="1" />
			<rect x="4" y="14" width="6" height="6" rx="1" />
			<path d="M14 14h2.5v2.5H14zM18 18h2v2h-2zM14 19.5h1.5M19.5 14v2" />
		</>
	),
	scissors: (
		<>
			<circle cx="6.5" cy="7" r="2.5" />
			<circle cx="6.5" cy="17" r="2.5" />
			<path d="M8.6 8.4L19 17M8.6 15.6L19 7" />
		</>
	),
	dumbbell: <path d="M6.5 8v8M17.5 8v8M4 10v4M20 10v4M6.5 12h11" />,
	glass: <path d="M7.5 3.5h9l-.5 5a4 4 0 0 1-8 0zM12 12.5v7M8.5 20h7" />,
	book: (
		<path d="M4 5.5c3-1 5.5-.8 8 1 2.5-1.8 5-2 8-1v13c-3-1-5.5-.8-8 1-2.5-1.8-5-2-8-1zM12 6.5v13" />
	),
	plate: (
		<>
			<circle cx="12" cy="12" r="7.5" />
			<circle cx="12" cy="12" r="4" />
		</>
	),
	spark: (
		<path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.6 2.6M15.4 15.4L18 18M18 6l-2.6 2.6M8.6 15.4L6 18" />
	),
	car: (
		<>
			<path d="M4 16v-3.5l2-5h12l2 5V16M3.5 16h17v2.5h-17z" />
			<circle cx="7.5" cy="14" r=".6" />
			<circle cx="16.5" cy="14" r=".6" />
		</>
	),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

type IconProps = {
	name: IconName;
	className?: ClassName;
};

export function Icon({ name, className }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className={cn("ui-icon", className)}
		>
			{paths[name]}
		</svg>
	);
}

/** The Lealcito mark: a check inside a rounded square. */
export function LogoMark({ className }: { className?: ClassName }) {
	return (
		<svg
			viewBox="0 0 28 28"
			aria-hidden="true"
			className={cn("size-7", className)}
		>
			<rect
				x="1"
				y="1"
				width="26"
				height="26"
				rx="9"
				className="fill-brand-600"
			/>
			<path
				d="M8.5 14.5l3.6 3.6 7.4-8"
				fill="none"
				className="stroke-white"
				strokeWidth="2.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
