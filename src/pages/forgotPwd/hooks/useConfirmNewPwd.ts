import { AuthError, confirmResetPassword } from "aws-amplify/auth";
import { useToast } from "@/hooks/useToast";

const useConfirmNewPwd = () => {
    const { showToast } = useToast();

    const confirmNewPwd = async (email: string, code: string, newPass: string) => {
        try {
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword: newPass,
            });
            showToast("success", "Password reset successfully! Please sign in.");
        } catch (err) {
            if (err instanceof AuthError && err.name === "CodeMismatchException") {
                showToast("error", "Invalid confirmation code!");
            } else {
                showToast("error", "Failed to reset password. Please try again.");
                console.error("Error resetting password:", err);
            }
        }
    };

    return { confirmNewPwd };
};

export default useConfirmNewPwd;