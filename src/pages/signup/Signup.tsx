import { useState } from "react";
import { useLocation } from "wouter";
import { HomeIcon } from "@/assets";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import SIGNUP_FIELDS, { type FieldConfig } from "./FieldsConfig";
import { useSignup } from "./hooks";

export default function SignupPage() {
	const [, navigate] = useLocation();
	const { handleSignup } = useSignup();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState<Record<string, string>>({
		preferred_username: "",
		email: "",
		password: "",
	});

	const initialFormValidity = SIGNUP_FIELDS.reduce(
		(acc, f) => {
			acc[f.name] = false;
			return acc;
		},
		{} as Record<string, boolean>,
	);

	const [fieldValidity, setFieldValidity] =
		useState<Record<string, boolean>>(initialFormValidity);

	const isFormValid = Object.values(fieldValidity).every(Boolean);

	const handleSignupSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (!isFormValid) {
			return;
		}

		setIsSubmitting(true);
		await handleSignup(form);
		setIsSubmitting(false);
	};

	const renderFields = (
		fields: FieldConfig[],
		onValidationChange: (name: string, valid: boolean) => void,
	) =>
		fields.map((field) => (
			<TextInput
				key={field.name}
				name={field.name}
				label={field.label}
				type={field.type}
				placeholder={field.placeholder}
				value={form[field.name] ?? ""}
				onChange={(v) => setForm((p) => ({ ...p, [field.name]: v }))}
				onValidationChange={onValidationChange}
				required
				validations={field.validations}
			/>
		));

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg-page px-4 py-12">
			<div className="w-full max-w-md">
				{/* Logo */}
				<div className="flex items-center gap-2.5 mb-8 justify-center">
					<HomeIcon className="w-12 h-12 text-primary" />
					<span className="text-xl font-bold text-text-heading">DocsDrive</span>
				</div>

				{/* Card */}
				<div className="bg-bg-card rounded-2xl shadow-sm border border-border p-8">
					<h1 className="text-2xl font-bold text-text-heading mb-1">
						Create an account
					</h1>
					<p className="text-sm text-text-muted mb-6">
						Start managing your home appliances today
					</p>

					<form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
						{renderFields(SIGNUP_FIELDS, (name, valid) =>
							setFieldValidity((p) => ({ ...p, [name]: valid })),
						)}
						<Button
							label={isSubmitting ? "Creating account…" : "Create Account"}
							type="submit"
							variant="primary"
							fullWidth
							disabled={!isFormValid || isSubmitting}
						/>
					</form>

					<p className="mt-6 text-center text-sm text-text-muted">
						Already have an account?{" "}
						<button
							type="button"
							onClick={() => navigate("/login")}
							className="text-primary font-medium hover:underline cursor-pointer"
						>
							Sign in
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
