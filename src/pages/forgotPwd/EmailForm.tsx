import { useState } from "react";
import { Button } from "@/components/button";
import { TextInput } from "@/components/form";
import type { ValidationRule } from "@/types";

interface EmailFormProps {
	onSubmit: (email: string) => Promise<void>;
	isPending: boolean;
}

const emailValidations: ValidationRule[] = [
	{ type: "required", message: "Email is required" },
	{
		type: "pattern",
		value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		message: "Please enter a valid email address",
	},
];

export function EmailForm({ onSubmit, isPending }: EmailFormProps) {
	const [email, setEmail] = useState("");
	const [isValid, setIsValid] = useState(false);

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (isValid) onSubmit(email);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<TextInput
				name="email"
				label="Email Address"
				type="email"
				placeholder="you@example.com"
				value={email}
				onChange={setEmail}
				onValidationChange={(_, valid) => setIsValid(valid)}
				required
				validations={emailValidations}
			/>

			<Button
				label={isPending ? "Sending code…" : "Send Reset Code"}
				type="submit"
				variant="primary"
				fullWidth
				disabled={!isValid || isPending}
			/>
		</form>
	);
}
