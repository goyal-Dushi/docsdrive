import React from "react";
import { Inputs } from "@/components/form";
import { PRODUCT_FIELD_CONFIG } from "../../../../ProductFieldsConfig";
import type { Product } from "@/types/bill";

interface ProductInfoProps {
	idx: number;
	product: Product;
	updateProduct: (index: number, field: keyof Product, value: any) => void;
	handleValidationChange: (name: string, valid: boolean) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
	idx,
	product,
	updateProduct,
	handleValidationChange,
}) => {
	return (
		<div className="space-y-8">
			{PRODUCT_FIELD_CONFIG.slice(0, 2).map((group) => (
				<div key={group.groupLabel}>
					<p className={`text-xs font-bold ${group.groupColor} uppercase tracking-widest mb-6 opacity-80`}>
						{group.groupLabel}
					</p>
					<div className="flex flex-col gap-6">
						{group.fields.map((field, fIdx) => {
							const isGrid = field.gridCols === 2;
							const nextField = group.fields[fIdx + 1];
							const isPairStart = isGrid && nextField?.gridCols === 2;

							if (isPairStart) {
								return (
									<div key={`${field.name}-${nextField.name}`} className="grid grid-cols-2 gap-4">
										<Inputs
											type={field.type}
											name={`${idx}-${field.name}`}
											label={field.label}
											value={(product as any)[field.name] || ""}
											onChange={(v) => updateProduct(idx, field.name as keyof Product, v)}
											onValidationChange={handleValidationChange}
											rows={field.rows}
											validations={field.validations}
											required={field.required}
										/>
										<Inputs
											type={nextField.type}
											name={`${idx}-${nextField.name}`}
											label={nextField.label}
											value={(product as any)[nextField.name] || ""}
											onChange={(v) => updateProduct(idx, nextField.name as keyof Product, v)}
											onValidationChange={handleValidationChange}
											rows={nextField.rows}
											validations={nextField.validations}
											required={nextField.required}
										/>
									</div>
								);
							}

							if (isGrid && group.fields[fIdx - 1]?.gridCols === 2) {
								return null;
							}

							return (
								<Inputs
									type={field.type}
									name={`${idx}-${field.name}`}
									label={field.label}
									value={(product as any)[field.name] || ""}
									onChange={(v) => updateProduct(idx, field.name as keyof Product, v)}
									onValidationChange={handleValidationChange}
									rows={field.rows}
									validations={field.validations}
									required={field.required}
								/>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductInfo;
