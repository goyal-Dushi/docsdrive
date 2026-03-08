import clsx from "clsx";
import type { IconButtonProps } from "@/types";

export function IconButton({
	icon,
	tooltip,
	variant = "secondary",
	onClick,
	disabled = false,
	className,
}: IconButtonProps) {
	const base =
		"inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer";

	const variants = {
		primary:
			"bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed",
		secondary:
			"bg-transparent text-[var(--color-secondary)] hover:bg-[var(--color-bg-page)] hover:text-[var(--color-text-body)] focus:ring-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed",
	};

	return (
		<button
			type="button"
			title={tooltip}
			aria-label={tooltip}
			onClick={onClick}
			disabled={disabled}
			className={clsx(base, variants[variant], className)}
		>
			{icon}
		</button>
	);
}
