import { useState } from "react";
import { useLocation } from "wouter";
import { AuthLogo } from "@/components/header";
import { EmailForm } from "./EmailForm";
import { useConfirmNewPwd, useSendEmail } from "./hooks";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ForgotPwdPage() {
	const [, navigate] = useLocation();
	const { sendEmail } = useSendEmail();
	const { confirmNewPwd } = useConfirmNewPwd();

	const [isPending, setIsPending] = useState(false);
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");

	const handleRequestCode = async (userEmail: string) => {
		setIsPending(true);
		await sendEmail(userEmail);
		setIsPending(false);
		setEmail(userEmail);
		setStep(2);
	};

	const handleResetPassword = async (code: string, newPass: string) => {
		setIsPending(true);
		await confirmNewPwd(email, code, newPass);
		setIsPending(false);
		navigate("/login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg-page px-4 py-12">
			<div className="w-full max-w-md">
				<AuthLogo />

				<div className="bg-bg-card rounded-2xl shadow-sm border border-border p-8 text-center">
					<h1 className="text-2xl font-bold text-text-heading mb-1">
						{step === 1 ? "Forgot Password" : "Reset Password"}
					</h1>
					<p className="text-sm text-text-muted mb-6">
						{step === 1
							? "Enter your email to receive a reset code"
							: "Enter the code sent to your email and your new password"}
					</p>

					{step === 1 ? (
						<EmailForm onSubmit={handleRequestCode} isPending={isPending} />
					) : (
						<ResetPasswordForm
							email={email}
							onSubmit={handleResetPassword}
							isPending={isPending}
							onResubmitEmail={() => setStep(1)}
						/>
					)}

					<div className="mt-6 border-t border-border pt-6">
						<p className="text-sm text-text-muted">
							Remembered your password?{" "}
							<button
								type="button"
								onClick={() => navigate("/login")}
								className="text-primary font-medium hover:underline cursor-pointer"
							>
								Back to Sign in
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
