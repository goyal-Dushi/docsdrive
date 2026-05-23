import React from "react";
import { ProductIcon } from "@/assets";
import { TextArea } from "@/components/form";
import type { BillDetail, Product } from "@/types/bill";
import ProductInfo from "./components/ProductInfo";
import DatesAndFinancials from "./components/DatesAndFinancials";

interface LeftViewProps {
	formData: BillDetail;
	updateProduct: (index: number, field: keyof Product, value: any) => void;
	handleValidationChange: (name: string, valid: boolean) => void;
	CLOUDFRONT_DOMAIN: string;
}

const LeftView: React.FC<LeftViewProps> = ({
	formData,
	updateProduct,
	handleValidationChange,
	CLOUDFRONT_DOMAIN,
}) => {
	return (
		<div className="flex-1 flex flex-col gap-8">
			<div className="flex items-center gap-3 py-2 border-b border-border">
				<h2 className="text-xl font-bold text-text-heading">Products</h2>
			</div>

			{formData.products.map((product, idx) => (
				<div
					key={product.id || idx}
					className="bg-bg-card rounded-2xl border border-border p-8 shadow-sm"
				>
					<div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
						<div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-[var(--color-border)]">
							{product.s3key ? (
								<img
									src={`${CLOUDFRONT_DOMAIN}/${product.s3key}`}
									alt={product.productName || "Product"}
									className="w-12 h-12 rounded-xl object-cover"
								/>
							) : (
								<ProductIcon />
							)}
						</div>
						<div className="flex flex-col">
							<h3 className="text-lg font-bold text-text-heading opacity-90">
								{product.productName || `Product ${idx + 1}`}
							</h3>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
						{/* Product Info */}
						<ProductInfo
							idx={idx}
							product={product}
							updateProduct={updateProduct}
							handleValidationChange={handleValidationChange}
						/>

						{/* Dates & Financials */}
						<DatesAndFinancials
							idx={idx}
							product={product}
							updateProduct={updateProduct}
							handleValidationChange={handleValidationChange}
						/>
					</div>

					<div className="mt-10 pt-8 border-t border-[var(--color-border)]">
						<TextArea
							name={`${idx}-rawText`}
							label="Remaining Raw Text"
							value={product.rawText || ""}
							onChange={(v) => updateProduct(idx, "rawText", v)}
							rows={4}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default LeftView;
