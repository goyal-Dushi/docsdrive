import React from "react";
import { TextInput } from "./TextInput";
import { DateInput } from "./DateInput";
import { NumberInput } from "./NumberInput";
import { TextArea } from "./TextArea";
import { SelectInput } from "./SelectInput";
import type { FormFieldBaseProps } from "@/types";

type InputType = "text" | "date" | "number" | "textarea" | "select";

interface InputsProps extends FormFieldBaseProps {
	type: InputType;
	rows?: number; // Specific to TextArea
	min?: number; // Specific to NumberInput
	max?: number; // Specific to NumberInput
	step?: number; // Specific to NumberInput
	options?: string[]; // Specific to SelectInput
}

const Inputs: React.FC<InputsProps> = (props) => {
	const { type, ...rest } = props;

	switch (type) {
		case "date":
			return <DateInput {...rest} />;
		case "number":
			return <NumberInput {...rest} />;
		case "textarea":
			return <TextArea {...rest} />;
		case "select":
			return <SelectInput {...rest} />;
		case "text":
		default:
			return <TextInput {...rest} />;
	}
};

export default Inputs;
