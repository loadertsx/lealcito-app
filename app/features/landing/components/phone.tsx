import type { ReactNode, Ref } from "react";
import { type ClassName, type ClassNameRecord, cn } from "~/shared/lib/cn";
import { Icon, type IconName } from "./icon";

type PhoneProps = {
	label: string;
	children: ReactNode;
	ref?: Ref<HTMLDivElement>;
	className?: ClassNameRecord<"root" | "screen">;
};

/** A realistic phone mockup. Its screen is the positioning context for overlays. */
export function Phone({ label, children, ref, className }: PhoneProps) {
	return (
		<div
			role="img"
			aria-label={label}
			className={cn(
				"relative aspect-[300/620] w-68 shrink-0 rounded-[54px] p-1 sm:w-75",
				"bg-linear-145 from-metal-light via-metal to-metal-soft",
				"shadow-[0_0_0_0.5px_rgb(0_0_0/0.25),0_50px_70px_-40px_rgb(45_42_30/0.55)]",
				className?.root,
			)}
		>
			<div className="h-full rounded-[50px] bg-bezel p-2.5">
				<div
					ref={ref}
					className={cn(
						"relative v-stack h-full overflow-hidden rounded-[40px] bg-paper text-sm text-ink",
						className?.screen,
					)}
				>
					<span className="-translate-x-1/2 absolute top-2.5 left-1/2 z-20 h-6.5 w-22 rounded-full bg-black" />
					<StatusBar />
					{children}
				</div>
			</div>
		</div>
	);
}

function StatusBar() {
	return (
		<div className="h-stack h-11 shrink-0 items-center justify-between px-7 pt-3 font-semibold text-sm">
			<span>9:41</span>
			<span className="h-stack items-end gap-1">
				{["h-1", "h-1.5", "h-2", "h-2.5"].map((height) => (
					<i
						key={height}
						className={cn("block w-[3px] rounded-[1px] bg-ink", height)}
					/>
				))}
				<span className="ml-1 h-[11px] w-[22px] rounded-[4px] border-[1.3px] border-ink p-px">
					<span className="block h-full w-3/4 rounded-[2px] bg-ink" />
				</span>
			</span>
		</div>
	);
}

type FakeInputProps = {
	value: string;
	placeholder: string;
	focused: boolean;
	icon?: IconName;
	className?: ClassName;
};

/** Looks like a text field inside a phone scene; it is not interactive. */
export function FakeInput({
	value,
	placeholder,
	focused,
	icon,
	className,
}: FakeInputProps) {
	return (
		<span
			className={cn(
				"h-stack min-h-11 items-center gap-2 rounded-2xl border-[1.5px] border-sand-200 bg-white px-3.5 font-medium",
				focused && "border-brand-600 ring-3 ring-brand-50",
				className,
			)}
		>
			{icon && <Icon name={icon} className="size-4 text-faint" />}
			{value ? (
				<span>{value}</span>
			) : (
				<span className="font-normal text-faint">{placeholder}</span>
			)}
			{focused && <span className="-ml-1.5 h-4.5 w-px animate-blink bg-ink" />}
		</span>
	);
}

type FakeButtonProps = {
	children: ReactNode;
	pressed?: boolean;
	off?: boolean;
	size?: "md" | "sm";
	className?: ClassName;
};

export function FakeButton({
	children,
	pressed,
	off,
	size = "md",
	className,
}: FakeButtonProps) {
	return (
		<span
			className={cn(
				"center rounded-full font-semibold transition duration-150 ease-out-soft",
				{
					"px-4 py-3 text-sm": size === "md",
					"px-3.5 py-2 text-xs": size === "sm",
				},
				off
					? "bg-sand-100 text-faint"
					: "bg-linear-to-b from-brand-500 to-brand-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]",
				pressed && "scale-95 brightness-95",
				className,
			)}
		>
			{children}
		</span>
	);
}
