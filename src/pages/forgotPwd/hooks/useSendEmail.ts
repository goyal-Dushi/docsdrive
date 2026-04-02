import { AuthError, resetPassword } from "aws-amplify/auth";
import { useToast } from "@/hooks/useToast";

const useSendEmail = () => {
    const { showToast } = useToast();

    const sendEmail = async (email: string) => {
        try {
            await resetPassword({ username: email });
            showToast("success", "Reset code sent to your email!");
        } catch (err) {
            if (err instanceof AuthError && err.name === "UserNotFoundException") {
                showToast("error", "No account found with this email!");
            } else {
                showToast("error", "Something went wrong, please try again.");
                console.error("Error requesting reset code:", err);
            }
        }
    };

    return { sendEmail };
};

export default useSendEmail;