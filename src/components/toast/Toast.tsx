import { useEffect } from "react";
import type { ToastType } from "../../context/ToastContext";

interface ToastProps {
	id: string;
	type: ToastType;
	message: string;
	timeout: number;
	onRemove: (id: string) => void;
}

const Toast = ({ id, type, message, timeout, onRemove }: ToastProps) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onRemove(id);
		}, timeout * 1000);

		return () => clearTimeout(timer);
	}, [id, timeout, onRemove]);

	const getTypeStyles = () => {
		switch (type) {
			case "success":
				return "bg-green-50 text-green-800 border-green-200";
			case "warning":
				return "bg-yellow-50 text-yellow-800 border-yellow-200";
			case "error":
				return "bg-red-50 text-red-800 border-red-200";
			default:
				return "bg-gray-50 text-gray-800 border-gray-200";
		}
	};

	const getIcon = () => {
		switch (type) {
			case "success":
				return (
					<svg
						className="w-5 h-5 text-green-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				);
			case "warning":
				return (
					<svg
						className="w-5 h-5 text-yellow-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				);
			case "error":
				return (
					<svg
						className="w-5 h-5 text-red-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				);
		}
	};

	return (
		<div
			className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 ${getTypeStyles()}`}
			role="alert"
		>
			<div className="shrink-0">{getIcon()}</div>
			<div className="flex-1 text-sm font-medium">{message}</div>
			<button
				type="button"
				onClick={() => onRemove(id)}
				className="shrink-0 transition-opacity hover:opacity-70"
			>
				<svg
					className="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Toast;
