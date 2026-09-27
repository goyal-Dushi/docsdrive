import clsx from "clsx";
import { useCallback, useState } from "react";
import type { FormFieldBaseProps } from "@/types";
import { runValidations } from "./validationUtils";

interface SelectInputProps extends FormFieldBaseProps {
    options?: string[];
    placeholder?: string;
}

export function SelectInput({
    name,
    label,
    placeholder = "Select Option",
    value,
    onChange,
    onValidationChange,
    validations = [],
    required = false,
    disabled = false,
    className,
    options = [],
}: SelectInputProps) {
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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onChange(val);
        if (touched) validate(val);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
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
                <select
                    id={name}
                    name={name}
                    value={value}
                    disabled={disabled}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={clsx(
                        "w-full rounded-xl border-2 px-4 py-3 text-sm text-text-body transition-all duration-200 outline-none appearance-none cursor-pointer",
                        "bg-bg-card",
                        !value && "text-text-muted",
                        hasError
                            ? "border-error focus:ring-4 focus:ring-error-bg border-opacity-100"
                            : "border-border focus:border-primary focus:ring-4 focus:ring-primary-light",
                        disabled &&
                        "opacity-50 cursor-not-allowed bg-bg-page border-border",
                    )}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 6, 18 6, 12 12, 12 12, 18 18, 6 18" />
                </svg>
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