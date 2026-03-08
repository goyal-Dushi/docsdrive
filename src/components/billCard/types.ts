export interface Bill {
	id: string;
	vendor: string;
	date: string;
	description: string;
	status: "DONE" | "PROCESSING" | "FAILED";
	hasWarranty: boolean;
}
