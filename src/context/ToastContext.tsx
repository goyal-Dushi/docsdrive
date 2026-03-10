import type React from "react";
import { createContext, type ReactNode, useCallback, useState } from "react";
import ToastContainer from "../components/toast/ToastContainer";

export type ToastType = "success" | "warning" | "error";

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	timeout: number;
}

interface ToastContextData {
	showToast: (type: ToastType, message: string, timeout?: number) => void;
}

export const ToastContext = createContext<ToastContextData>(
	{} as ToastContextData,
);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback(
		(type: ToastType, message: string, timeout = 3) => {
			const id = Math.random().toString(36).substring(2, 9);
			setToasts((prev) => [...prev, { id, type, message, timeout }]);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
};
