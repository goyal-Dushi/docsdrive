import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { HomeIcon } from "@/assets";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import { http } from "@/hooks/useHttp";
import type { ValidationRule } from "@/types";

interface FieldConfig {
	name: string;
	label: string;
	type: "text" | "email" | "password";
	placeholder: string;
	validations: ValidationRule[];
}

const SIGNUP_FIELDS: FieldConfig[] = [
	{
		name: "preferred_username",
		label: "Username",
		type: "text",
		placeholder: "johndoe",
		validations: [
			{ type: "required", message: "Username is required" },
			{
				type: "min",
				value: 3,
				message: "Username must be at least 3 characters",
			},
			{
				type: "pattern",
				value: /^[a-zA-Z0-9_]+$/,
				message: "Only letters, numbers and underscores allowed",
			},
		],
	},
	{
		name: "email",
		label: "Email Address",
		type: "email",
		placeholder: "you@example.com",
		validations: [
			{ type: "required", message: "Email is required" },
			{
				type: "pattern",
				value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				message: "Please enter a valid email address",
			},
		],
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "••••••••",
		validations: [
			{ type: "required", message: "Password is required" },
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

export default function SignupPage() {
	const [, navigate] = useLocation();
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

	const signupMutation = useMutation({
		mutationFn: () =>
			http
				.post("/auth/signup", {
					username: form.preferred_username,
					email: form.email,
					password: form.password,
				})
				.then((r) => r.data),
		onSuccess: () => {
			const params = new URLSearchParams();
			params.set("email", form.email);
			params.set("username", form.preferred_username);
			navigate(`/confirm-signup?${params.toString()}`);
		},
	});

	const getErrorMessage = (mutation: { error: unknown }) =>
		(mutation.error as { message?: string })?.message ??
		"Something went wrong. Please try again.";

	const handleSignupSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) return;
		signupMutation.mutate();
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
					<div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
						<HomeIcon className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold text-text-heading">
						Digital Home Binder
					</span>
				</div>

				{/* Card */}
				<div className="bg-bg-card rounded-2xl shadow-sm border border-border p-8">
					<h1 className="text-2xl font-bold text-text-heading mb-1">
						Create an account
					</h1>
					<p className="text-sm text-text-muted mb-6">
						Start managing your home appliances today
					</p>

					{signupMutation.isError && (
						<div className="mb-4 p-3 rounded-lg bg-error-bg border border-error text-error text-sm">
							{getErrorMessage(signupMutation)}
						</div>
					)}

					<form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
						{renderFields(SIGNUP_FIELDS, (name, valid) =>
							setFieldValidity((p) => ({ ...p, [name]: valid })),
						)}
						<Button
							label={
								signupMutation.isPending
									? "Creating account…"
									: "Create Account"
							}
							type="submit"
							variant="primary"
							fullWidth
							disabled={!isFormValid || signupMutation.isPending}
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
