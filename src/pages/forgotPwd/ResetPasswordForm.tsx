import { useState } from "react";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import type { FieldConfig } from "../signup/FieldsConfig";

interface ResetPasswordFormProps {
	email: string;
	onResubmitEmail: () => void;
	onSubmit: (code: string, newPassword: string) => Promise<void>;
	isPending: boolean;
}

const FIELD_CONFIG: FieldConfig[] = [
	{
		name: "code",
		label: "Confirmation Code",
		type: "text",
		placeholder: "123456",
		validations: [
			{ type: "required", message: "Code is required" },
			{
				type: "pattern",
				value: /^\d{6}$/,
				message: "Code must be exactly 6 digits",
			},
		],
	},
	{
		name: "newPassword",
		label: "New Password",
		type: "password",
		placeholder: "••••••••",
		validations: [
			{
				type: "min",
				value: 8,
				message: "Password must be at least 8 characters",
			},
			{
				type: "pattern",
				value: /^(?=.*[A-Z])(?=.*[0-9])/,
				message: "Must include at least one uppercase letter and one number",
			},
		],
	},
];

export function ResetPasswordForm({
	email,
	onResubmitEmail,
	onSubmit,
	isPending,
}: ResetPasswordFormProps) {
	const [resetForm, setResetForm] = useState<Record<string, string>>({
		code: "",
		newPassword: "",
	});
	const [validity, setValidity] = useState({ code: false, newPassword: false });

	const isFormValid = validity.code && validity.newPassword;

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (isFormValid) onSubmit(resetForm.code, resetForm.newPassword);
	};

	const renderFields = () => {
		return FIELD_CONFIG.map((field) => {
			return (
				<TextInput
					key={field.name}
					name={field.name}
					label={field.label}
					type={field.type}
					placeholder={field.placeholder}
					value={resetForm[field.name]}
					onChange={(v) => setResetForm((p) => ({ ...p, [field.name]: v }))}
					onValidationChange={(_, valid) =>
						setValidity((p) => ({ ...p, [field.name]: valid }))
					}
					required
					validations={field.validations}
				/>
			);
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1 mb-2">
				<p className="text-sm font-medium text-text-muted">
					Reset code sent to:
				</p>
				<p className="text-sm font-bold text-text-heading">{email}</p>
			</div>

			{renderFields()}

			<Button
				label={isPending ? "Resetting…" : "Reset Password"}
				type="submit"
				variant="primary"
				fullWidth
				disabled={!isFormValid || isPending}
			/>

			<button
				type="button"
				onClick={onResubmitEmail}
				className="text-sm text-primary font-medium hover:underline self-center"
			>
				Back to email entry
			</button>
		</form>
	);
}
