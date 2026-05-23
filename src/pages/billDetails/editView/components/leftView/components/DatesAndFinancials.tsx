import React from "react";
import { Inputs } from "@/components/form";
import { PRODUCT_FIELD_CONFIG } from "../../../../ProductFieldsConfig";
import type { Product } from "@/types/bill";

interface DatesAndFinancialsProps {
	idx: number;
	product: Product;
	updateProduct: (index: number, field: keyof Product, value: any) => void;
	handleValidationChange: (name: string, valid: boolean) => void;
}

const DatesAndFinancials: React.FC<DatesAndFinancialsProps> = ({
	idx,
	product,
	updateProduct,
	handleValidationChange,
}) => {
	return (
 		<div className="space-y-8">
 			{PRODUCT_FIELD_CONFIG.filter((g) =>
 				g.groupLabel === "Dates" || g.groupLabel === "Financials & Registry",
 			).map((group) => (
				<div key={group.groupLabel}>
					<p className={`text-xs font-bold ${group.groupColor} uppercase tracking-widest mb-6 opacity-80`}>
						{group.groupLabel}
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{group.fields.map((field) => (
							<Inputs
								key={field.name}
								type={field.type}
								name={`${idx}-${field.name}`}
								label={field.label}
								value={(product as any)[field.name] || ""}
								onChange={(v) => {
									const val = field.type === "number" ? (v === "" ? undefined : Number(v)) : v;
									updateProduct(idx, field.name as keyof Product, val);
								}}
								onValidationChange={handleValidationChange}
								rows={field.rows}
								validations={field.validations}
								required={field.required}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default DatesAndFinancials;
