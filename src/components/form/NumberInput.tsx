import clsx from "clsx";
import { useCallback, useState } from "react";
import type { FormFieldBaseProps } from "@/types";
import { runValidations } from "./validationUtils";

interface NumberInputProps extends Omit<FormFieldBaseProps, "value"> {
	value: string;
	min?: number;
	max?: number;
	step?: number;
}

export function NumberInput({
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
	min,
	max,
	step,
}: NumberInputProps) {
	const [error, setError] = useState<string | null>(null);
	const [touched, setTouched] = useState(false);

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
		<div className={clsx("flex flex-col gap-1", className)}>
			<label
				htmlFor={name}
				className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]"
			>
				{label}
				{required && (
					<span className="ml-0.5 text-[var(--color-error)]">*</span>
				)}
			</label>
			<input
				id={name}
				name={name}
				type="number"
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				min={min}
				max={max}
				step={step}
				onChange={handleChange}
				onBlur={handleBlur}
				className={clsx(
					"w-full rounded-lg border px-3 py-2 text-sm text-[var(--color-text-body)] placeholder-[var(--color-text-muted)] transition-colors duration-150",
					"focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
					"bg-[var(--color-bg-card)]",
					hasError
						? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
						: "border-[var(--color-border)]",
					disabled && "opacity-50 cursor-not-allowed bg-[var(--color-bg-page)]",
				)}
			/>
			{hasError && (
				<p className="text-xs text-[var(--color-error)] mt-0.5">{error}</p>
			)}
		</div>
	);
}
