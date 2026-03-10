import clsx from "clsx";

interface StatusBadgeProps {
	status: string;
}

const colors: Record<string, string> = {
	connected:
		"bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]",
	connecting:
		"bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]",
	disconnected: "bg-gray-100 text-gray-500 border-gray-300",
	error:
		"bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]",
};

const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
	const { status } = props;

	return (
		<span
			className={clsx(
				"text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm",
				colors[status] ?? colors.disconnected,
			)}
		>
			{status.toUpperCase()}
		</span>
	);
};

export default StatusBadge;
