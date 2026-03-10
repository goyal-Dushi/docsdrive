import { signIn } from "aws-amplify/auth";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import { AuthLogo } from "@/components/header";
import type { ValidationRule } from "@/types";

interface LoginResponse {
	accessToken: string;
}

interface FieldConfig {
	name: "email" | "password";
	label: string;
	type: "text" | "email" | "password";
	placeholder: string;
	validations: ValidationRule[];
}

const LOGIN_FIELDS: FieldConfig[] = [
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
		],
	},
];

export default function LoginPage() {
	const [, navigate] = useLocation();
	const [isPending, setIsPending] = useState(false);
	const [form, setForm] = useState<Record<string, string>>({
		email: "",
		password: "",
	});
	const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>(
		LOGIN_FIELDS.reduce(
			(acc, f) => {
				acc[f.name] = false;
				return acc;
			},
			{} as Record<string, boolean>,
		),
	);

	const isFormValid = Object.values(fieldValidity).every(Boolean);

	const handleValidationChange = (name: string, valid: boolean) => {
		setFieldValidity((prev) => ({ ...prev, [name]: valid }));
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!isFormValid) return;

		try {
			setIsPending(true);
			await signIn({
				username: form.email,
				password: form.password,
			});
			setIsPending(false);
			navigate("/dashboard");
		} catch (err) {
			setIsPending(false);
			console.error("Error during sign in : ", err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg-page px-4 py-12">
			<div className="w-full max-w-md">
				{/* Logo */}
				<AuthLogo />

				{/* Card */}
				<div className="bg-bg-card rounded-2xl shadow-sm border border-border p-8">
					<h1 className="text-2xl font-bold text-text-heading mb-1">
						Welcome back
					</h1>
					<p className="text-sm text-text-muted mb-6">
						Sign in to your account to continue
					</p>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						{LOGIN_FIELDS.map((field) => (
							<TextInput
								key={field.name}
								name={field.name}
								label={field.label}
								type={field.type}
								placeholder={field.placeholder}
								value={form[field.name] ?? ""}
								onChange={(v) => setForm((p) => ({ ...p, [field.name]: v }))}
								onValidationChange={handleValidationChange}
								required
								validations={field.validations}
							/>
						))}

						<Button
							label={isPending ? "Signing in…" : "Sign In"}
							type="submit"
							variant="primary"
							fullWidth
							disabled={!isFormValid || isPending}
						/>
					</form>

					<p className="mt-6 text-center text-sm text-text-muted">
						Don't have an account?{" "}
						<button
							type="button"
							onClick={() => navigate("/signup")}
							className="text-primary font-medium hover:underline cursor-pointer"
						>
							Sign up
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
