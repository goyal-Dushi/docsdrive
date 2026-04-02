import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import { AuthLogo } from "@/components/header";
import { useToast } from "@/components/toast";
import type { ValidationRule } from "@/types";

interface FieldConfig {
	name: string;
	label: string;
	type: "text" | "email" | "password";
	placeholder: string;
	validations: ValidationRule[];
}

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

export default function ConfirmSignupPage() {
	const [, navigate] = useLocation();
	const search = useSearch();
	const params = new URLSearchParams(search);
	const email = params.get("email") || "";
	const username = params.get("username") || "";

	const { showToast } = useToast();
	const [code, setCode] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [isprocessing, setIsProcessing] = useState(false);
	const [isResending, setIsResending] = useState(false);

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			setIsProcessing(true);
			const { isSignUpComplete } = await confirmSignUp({
				username: email,
				confirmationCode: code,
			});
			if (isSignUpComplete) {
				navigate("/login");
			}
		} catch (err) {
			console.error("Error while validating code: ", err);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleResendCode = async () => {
		try {
			setIsResending(true);
			await resendSignUpCode({
				username: email,
			});
			showToast("success", "Confirmation code resent to your email.");
		} catch (err) {
			console.error("Error resending code: ", err);
			showToast("error", "Failed to resend code. Please try again.");
		} finally {
			setIsResending(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg-page px-4 py-12">
			<div className="w-full max-w-md">
				{/* Logo */}
				<AuthLogo />

				<div className="bg-bg-card rounded-2xl shadow-sm border border-border p-8">
					<div className="flex items-center gap-3 mb-6">
						<div>
							<h1 className="text-xl font-bold text-text-heading">
								Check your email
							</h1>
							<p className="text-sm text-text-muted">
								We sent a code to{" "}
								{username ? (
									<strong>
										{username} ({email})
									</strong>
								) : (
									<strong>{email}</strong>
								)}
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<TextInput
							name="code"
							label="Confirmation Code"
							type="text"
							placeholder="Enter 6-digit code"
							value={code}
							onChange={setCode}
							onValidationChange={(_, valid) => setIsValid(valid)}
							required
							validations={CONFIRM_FIELDS[0].validations}
						/>
						<Button
							label={isprocessing ? "Verifying…" : "Verify Account"}
							type="submit"
							variant="primary"
							fullWidth
							disabled={!isValid || isprocessing || isResending}
						/>
						<button
							type="button"
							onClick={handleResendCode}
							disabled={isprocessing}
							className="text-sm text-primary hover:underline text-center cursor-pointer disabled:opacity-50"
						>
							{isResending ? "Resending..." : "Resend code"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
