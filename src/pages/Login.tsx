import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { HomeSvg } from "@/assets";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import { http } from "@/hooks/useHttp";
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

	const mutation = useMutation({
		mutationFn: () =>
			http
				.post<LoginResponse>("/auth/login", {
					email: form.email,
					password: form.password,
				})
				.then((r) => r.data),
		onSuccess: (data) => {
			localStorage.setItem("accessToken", data.accessToken);
			navigate("/");
		},
	});

	const handleValidationChange = (name: string, valid: boolean) => {
		setFieldValidity((prev) => ({ ...prev, [name]: valid }));
	};

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!isFormValid) return;
		mutation.mutate();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-(--color-bg-page) px-4 py-12">
			<div className="w-full max-w-md">
				{/* Logo */}
				<div className="flex items-center gap-2.5 mb-8 justify-center">
					<div className="w-9 h-9 rounded-lg bg-(--color-primary) flex items-center justify-center">
						<HomeSvg className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold text-(--color-text-heading)">
						Digital Home Binder
					</span>
				</div>

				{/* Card */}
				<div className="bg-(--color-bg-card) rounded-2xl shadow-sm border border-(--color-border) p-8">
					<h1 className="text-2xl font-bold text-(--color-text-heading) mb-1">
						Welcome back
					</h1>
					<p className="text-sm text-(--color-text-muted) mb-6">
						Sign in to your account to continue
					</p>

					{mutation.isError && (
						<div className="mb-4 p-3 rounded-lg bg-(--color-error-bg) border border-(--color-error) text-(--color-error) text-sm">
							{(mutation.error as { message?: string })?.message ??
								"Login failed. Please try again."}
						</div>
					)}

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
							label={mutation.isPending ? "Signing in…" : "Sign In"}
							type="submit"
							variant="primary"
							fullWidth
							disabled={!isFormValid || mutation.isPending}
						/>
					</form>

					<p className="mt-6 text-center text-sm text-(--color-text-muted)">
						Don't have an account?{" "}
						<button
							type="button"
							onClick={() => navigate("/signup")}
							className="text-(--color-primary) font-medium hover:underline cursor-pointer"
						>
							Sign up
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
