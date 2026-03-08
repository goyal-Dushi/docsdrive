import type { ValidationRule } from "@/types";

export function runValidations(
	value: string,
	rules: ValidationRule[],
): string | null {
	for (const rule of rules) {
		switch (rule.type) {
			case "required":
				if (!value || value.trim() === "") return rule.message;
				break;
			case "min": {
				const minNum = Number(rule.value);
				// For number fields the value is a numeric string; for text it's length
				const numericVal = parseFloat(value);
				if (!Number.isNaN(numericVal)) {
					if (numericVal < minNum) return rule.message;
				} else if (value.length < minNum) {
					return rule.message;
				}
				break;
			}
			case "max": {
				const maxNum = Number(rule.value);
				const numericVal = parseFloat(value);
				if (!Number.isNaN(numericVal)) {
					if (numericVal > maxNum) return rule.message;
				} else if (value.length > maxNum) {
					return rule.message;
				}
				break;
			}
			case "pattern":
				if (rule.value instanceof RegExp && !rule.value.test(value))
					return rule.message;
				if (
					typeof rule.value === "string" &&
					!new RegExp(rule.value).test(value)
				)
					return rule.message;
				break;
			case "custom":
				if (rule.validate && !rule.validate(value)) return rule.message;
				break;
		}
	}
	return null;
}
