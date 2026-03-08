import type { ReactNode } from "react";

// ─── Validation ─────────────────────────────────────────────────────────────

export type ValidationRuleType =
	| "required"
	| "min"
	| "max"
	| "pattern"
	| "custom";

export interface ValidationRule {
	type: ValidationRuleType;
	value?: string | number | RegExp;
	message: string;
	validate?: (val: string) => boolean;
}

// ─── Form Field Base ─────────────────────────────────────────────────────────

export interface FormFieldBaseProps {
	name: string;
	label: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onValidationChange?: (name: string, isValid: boolean) => void;
	validations?: ValidationRule[];
	required?: boolean;
	disabled?: boolean;
	className?: string;
}

// ─── Button ──────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary";
export type IconPosition = "start" | "end";

export interface ButtonProps {
	label: string;
	variant?: ButtonVariant;
	icon?: ReactNode;
	iconPosition?: IconPosition;
	onClick?: () => void;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	className?: string;
	fullWidth?: boolean;
}

export interface IconButtonProps {
	icon: ReactNode;
	tooltip: string;
	variant?: ButtonVariant;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
}
