import { AuthError, signUp } from "aws-amplify/auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/useToast";

const useSignup = () => {
    const { showToast } = useToast();
    const [, navigate] = useLocation();

    const handleSignup = async (form: Record<string, string>) => {
        try {
            await signUp({
                username: form.email,
                password: form.password,
                options: {
                    userAttributes: {
                        preferred_username: form.preferred_username,
                    },
                },
            });
            navigate(
                `/confirm-signup?email=${form.email}&username=${form.preferred_username}`,
            );
        } catch (err) {
            if (
                err instanceof AuthError &&
                err?.name === "UserLambdaValidationException"
            ) {
                showToast(
                    "warning",
                    "Username is already taken, please select anything else.",
                );
            } else {
                showToast("error", "Something went wrong, please try again later.");
                console.error("Error signing up user: ", err);
            }
        }
    }

    return { handleSignup }
}

export default useSignup;