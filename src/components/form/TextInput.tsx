import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useState } from "react";
import type { FormFieldBaseProps } from "@/types";
import { runValidations } from "./validationUtils";

interface TextInputProps extends FormFieldBaseProps {
	type?: "text" | "email" | "password" | "tel" | "url";
}

export function TextInput({
	name,
	label,
	placeholder,
	value,
	onChange,
	onValidationChange,
	validations = [],
	required = false,
	disabled = false,
	className,
	type = "text",
}: TextInputProps) {
	const [error, setError] = useState<string | null>(null);
	const [touched, setTouched] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const isPassword = type === "password";

	const validate = useCallback(
		(val: string) => {
			const err = runValidations(val, validations);
			setError(err);
			onValidationChange?.(name, err === null);
			return err;
		},
		[validations, name, onValidationChange],
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		onChange(val);
		if (touched) validate(val);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setTouched(true);
		validate(e.target.value);
	};

	const hasError = touched && error;

	return (
		<div className={clsx("flex flex-col gap-1.5", className)}>
			<label
				htmlFor={name}
				className="text-[10px] font-black uppercase tracking-widest text-text-muted"
			>
				{label}
				{required && <span className="ml-0.5 text-error">*</span>}
			</label>
			<div className="relative group">
				<input
					id={name}
					name={name}
					type={isPassword ? (showPassword ? "text" : "password") : type}
					value={value}
					placeholder={placeholder}
					disabled={disabled}
					onChange={handleChange}
					onBlur={handleBlur}
					className={clsx(
						"w-full rounded-xl border-2 px-4 py-3 text-sm text-text-body placeholder-text-muted transition-all duration-200 outline-none",
						"bg-bg-card",
						isPassword && "pr-12",
						hasError
							? "border-error focus:ring-4 focus:ring-error-bg border-opacity-100"
							: "border-border focus:border-primary focus:ring-4 focus:ring-primary-light",
						disabled &&
							"opacity-50 cursor-not-allowed bg-bg-page border-border",
					)}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						disabled={disabled}
						className={clsx(
							"absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors duration-200",
							disabled && "hidden",
						)}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				)}
			</div>
			{hasError && (
				<p className="text-[10px] font-bold text-error mt-1 uppercase tracking-wider flex items-center gap-1">
					<span className="w-1 h-1 rounded-full bg-error" />
					{error}
				</p>
			)}
		</div>
	);
}
