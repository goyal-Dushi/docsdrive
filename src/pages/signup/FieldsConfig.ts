import type { ValidationRule } from "@/types";

export interface FieldConfig {
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

export default SIGNUP_FIELDS;