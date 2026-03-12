import clsx from "clsx";
import type { ButtonProps } from "@/types";

export function Button({
	label,
	variant = "primary",
	icon,
	type,
	iconPosition = "start",
	onClick,
	disabled = false,
	className,
	fullWidth = false,
}: ButtonProps) {
	const base =
		"inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer select-none";

	const variants = {
		primary:
			"bg-primary text-white hover:bg-primary-dark focus:ring-primary disabled:bg-secondary disabled:cursor-not-allowed shadow-sm",
		secondary:
			"bg-bg-card text-text-body border border-border hover:bg-bg-page focus:ring-border disabled:opacity-50 disabled:cursor-not-allowed shadow-xs",
	};

	return (
		<button
			type={type || "button"}
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				base,
				variants[variant],
				fullWidth && "w-full",
				className,
			)}
		>
			{icon && iconPosition === "start" && (
				<span className="shrink-0">{icon}</span>
			)}
			<span>{label}</span>
			{icon && iconPosition === "end" && (
				<span className="shrink-0">{icon}</span>
			)}
		</button>
	);
}
