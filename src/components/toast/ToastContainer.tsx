import type { Toast as ToastType } from "../../context/ToastContext";
import Toast from "./Toast";

interface ToastContainerProps {
	toasts: ToastType[];
	onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
	return (
		<div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-sm px-4">
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					id={toast.id}
					type={toast.type}
					message={toast.message}
					timeout={toast.timeout}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
};

export default ToastContainer;
