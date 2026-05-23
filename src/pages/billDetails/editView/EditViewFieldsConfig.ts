import type { ValidationRule } from "@/types";

export interface EditFieldConfig {
	name: string;
	label: string;
	type: "text" | "date" | "number" | "textarea";
	placeholder?: string;
	rows?: number;
	validations?: ValidationRule[];
	required?: boolean;
	gridCols?: 1 | 2; // To handle the grid layout in EditView
}

export interface ProductFieldGroup {
	groupLabel: string;
	groupColor: string;
	fields: EditFieldConfig[];
}

export const PRODUCT_FIELD_CONFIG: ProductFieldGroup[] = [
	{
		groupLabel: "General Information",
		groupColor: "text-primary",
		fields: [
			{
				name: "productName",
				label: "Product Name",
				type: "textarea",
				rows: 2,
				required: true,
				validations: [{ type: "required", message: "This field is required" }],
			},
			{
				name: "modelNumber",
				label: "Model Number",
				type: "text",
				gridCols: 2,
			},
			{
				name: "serialNumber",
				label: "Serial Number",
				type: "text",
				gridCols: 2,
			},
			{
				name: "purchaserName",
				label: "Purchaser Name",
				type: "text",
			},
			{
				name: "brand",
				label: "Brand",
				type: "text",
				gridCols: 2,
			},
			{
				name: "category",
				label: "Category",
				type: "text",
				gridCols: 2,
			},
		],
	},
	{
		groupLabel: "Vendor Information",
		groupColor: "text-secondary",
		fields: [
			{
				name: "vendorName",
				label: "Vendor Name",
				type: "text",
			},
			{
				name: "vendorContact",
				label: "Vendor Contact",
				type: "text",
			},
			{
				name: "vendorAddress",
				label: "Vendor Address",
				type: "textarea",
				rows: 2,
			},
		],
	},
	{
		groupLabel: "Dates",
		groupColor: "text-[var(--color-primary)]",
		fields: [
			{
				name: "purchaseDate",
				label: "Purchase Date",
				type: "date",
				gridCols: 2,
				required: true,
				validations: [{ type: "required", message: "This field is required" }],
			},
			{
				name: "lastUpdated",
				label: "Last Updated",
				type: "date",
				gridCols: 2,
			},
			{
				name: "warrantyStart",
				label: "Warranty Start",
				type: "date",
				gridCols: 2,
			},
			{
				name: "warrantyEnd",
				label: "Warranty End",
				type: "date",
				gridCols: 2,
			},
		],
	},
	{
		groupLabel: "Financials & Registry",
		groupColor: "text-secondary",
		fields: [
			{
				name: "basePrice",
				label: "Base Price",
				type: "number",
				validations: [{ type: "min", value: 0, message: "Price cannot be negative" }],
			},
			{
				name: "gstPercent",
				label: "GST %",
				type: "number",
				gridCols: 2,
			},
			{
				name: "gstAmount",
				label: "GST Amount",
				type: "number",
				gridCols: 2,
			},
			{
				name: "paymentMode",
				label: "Payment Mode",
				type: "text",
			},
		],
	},
];
