import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import { http } from "@/hooks/useHttp";
import type { ValidationRule } from "@/types";

type SignupStep = "form" | "confirm";

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

const CONFIRM_FIELDS: FieldConfig[] = [
	{
		name: "code",
		label: "Confirmation Code",
		type: "text",
		placeholder: "Enter 6-digit code",
		validations: [
			{ type: "required", message: "Confirmation code is required" },
			{
				type: "pattern",
				value: /^\d{6}$/,
				message: "Code must be exactly 6 digits",
			},
		],
	},
];

export default function SignupPage() {
	const [, navigate] = useLocation();
	const [step, setStep] = useState<SignupStep>("form");
	const [form, setForm] = useState<Record<string, string>>({
		preferred_username: "",
		email: "",
		password: "",
		code: "",
	});

	const initialFormValidity = SIGNUP_FIELDS.reduce(
		(acc, f) => {
			acc[f.name] = false;
			return acc;
		},
		{} as Record<string, boolean>,
	);
	const initialCodeValidity = CONFIRM_FIELDS.reduce(
		(acc, f) => {
			acc[f.name] = false;
			return acc;
		},
		{} as Record<string, boolean>,
	);

	const [fieldValidity, setFieldValidity] =
		useState<Record<string, boolean>>(initialFormValidity);
	const [codeValidity, setCodeValidity] =
		useState<Record<string, boolean>>(initialCodeValidity);

	const isFormValid = Object.values(fieldValidity).every(Boolean);
	const isCodeValid = Object.values(codeValidity).every(Boolean);

	const signupMutation = useMutation({
		mutationFn: () =>
			http
				.post("/auth/signup", {
					username: form.username,
					email: form.email,
					password: form.password,
				})
				.then((r) => r.data),
		onSuccess: () => setStep("confirm"),
	});

	const confirmMutation = useMutation({
		mutationFn: () =>
			http
				.post("/auth/confirm", { email: form.email, code: form.code })
				.then((r) => r.data),
		onSuccess: () => navigate("/login"),
	});

	const getErrorMessage = (mutation: { error: unknown }) =>
		(mutation.error as { message?: string })?.message ??
		"Something went wrong. Please try again.";

	const handleSignupSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) return;
		signupMutation.mutate();
	};

	const handleConfirmSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isCodeValid) return;
		confirmMutation.mutate();
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
					<div className="w-9 h-9 rounded-lg bg-bg-page flex items-center justify-center">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					</div>
					<span className="text-xl font-bold text-text-heading">
						Digital Home Binder
					</span>
				</div>

				{/* Card */}
				<div className="bg-bg-card rounded-2xl shadow-sm border border-border p-8">
					{step === "form" ? (
						<>
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

							<form
								onSubmit={handleSignupSubmit}
								className="flex flex-col gap-4"
							>
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
						</>
					) : (
						<>
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-full bg-info-bg flex items-center justify-center">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="primary"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
										<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
									</svg>
								</div>
								<div>
									<h1 className="text-xl font-bold text-text-heading">
										Check your email
									</h1>
									<p className="text-sm text-text-muted">
										We sent a code to <strong>{form.email}</strong>
									</p>
								</div>
							</div>

							{confirmMutation.isError && (
								<div className="mb-4 p-3 rounded-lg bg-error-bg border border-error text-error text-sm">
									{getErrorMessage(confirmMutation)}
								</div>
							)}

							<form
								onSubmit={handleConfirmSubmit}
								className="flex flex-col gap-4"
							>
								{renderFields(CONFIRM_FIELDS, (name, valid) =>
									setCodeValidity((p) => ({ ...p, [name]: valid })),
								)}
								<Button
									label={
										confirmMutation.isPending ? "Verifying…" : "Verify Account"
									}
									type="submit"
									variant="primary"
									fullWidth
									disabled={!isCodeValid || confirmMutation.isPending}
								/>
								<button
									type="button"
									onClick={() => signupMutation.mutate()}
									className="text-sm text-primary hover:underline text-center cursor-pointer"
								>
									Resend code
								</button>
							</form>
						</>
					)}

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
