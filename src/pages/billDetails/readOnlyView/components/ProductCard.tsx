import { useState } from "react";
import { EditIcon, ProductIcon } from "@/assets";
import { IconButton } from "@/components/button";
import type { Product } from "@/types/bill";
import { PRODUCT_FIELD_CONFIG, type FieldGroup } from "../../ProductFieldsConfig";

interface ProductCardProps {
	product: Product;
	onEdit: () => void;
}

const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
	const [rawExpanded, setRawExpanded] = useState(false);

	return (
		<div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs hover:shadow-sm transition-shadow">
			<div className="flex items-center justify-between pb-5 mb-5 border-b border-border">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-border">
						{product.s3key ? (
							<img
								src={`${CLOUDFRONT_DOMAIN}/${product.s3key}`}
								alt={product.productName || "Product image"}
								className="w-12 h-12 rounded-xl object-cover"
							/>
						) : (
							<ProductIcon />
						)}
					</div>
					<h3 className="text-lg font-bold text-text-heading">
						{product.productName || "NA"}
					</h3>
				</div>
				<IconButton
					icon={<EditIcon />}
					tooltip="Edit this product"
					onClick={onEdit}
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
				{/* Left column */}
				<div className="flex flex-col gap-5">
					{PRODUCT_FIELD_CONFIG.slice(0, 2).map((group: FieldGroup) => (
						<div key={group.groupLabel}>
							<p className={`text-xs font-bold ${group.groupColor} uppercase tracking-widest mb-3 opacity-80`}>
								{group.groupLabel}
							</p>
							<dl className="space-y-3">
								{group.fields.map((field) => (
									<div key={field.name}>
										<dt className="text-xs text-text-muted font-medium mb-0.5">
											{field.label}
										</dt>
										<dd className="text-sm text-text-body font-semibold leading-relaxed">
											{product[field.name as keyof Product] != null && product[field.name as keyof Product] !== ""
												? product[field.name as keyof Product]
												: "NA"}
										</dd>
									</div>
								))}
							</dl>
						</div>
					))}
				</div>

				{/* Right column */}
				<div className="flex flex-col gap-5">
					{PRODUCT_FIELD_CONFIG.slice(2).map((group: FieldGroup) => (
						<div key={group.groupLabel}>
							<p className={`text-xs font-bold ${group.groupColor} uppercase tracking-widest mb-3 opacity-80`}>
								{group.groupLabel}
							</p>
							<dl className="space-y-3">
								{group.fields.map((field) => (
									<div
										key={field.name}
										className={`flex justify-between items-center py-1 border-b border-border border-dashed last:border-0 ${group.groupLabel === "Financials & Registry" ? "" : ""}`}
									>
										<dt className="text-xs text-text-muted font-medium">
											{field.label}
										</dt>
										<dd className="text-sm text-text-body font-semibold">
											{product[field.name as keyof Product] != null && product[field.name as keyof Product] !== ""
												? product[field.name as keyof Product]
												: "NA"}
										</dd>
									</div>
								))}
							</dl>
						</div>
					))}
				</div>
			</div>

			{/* Remaining Raw Text (collapsible) */}
			<div className="mt-6 pt-5 border-t border-border">
				<button
					type="button"
					onClick={() => setRawExpanded((v) => !v)}
					className="flex items-center justify-between w-full text-sm text-text-body font-bold cursor-pointer hover:text-primary transition-colors py-2"
				>
					<span>Remaining Raw Text</span>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={`transition-transform duration-300 ${rawExpanded ? "rotate-180" : ""}`}
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</button>
				{rawExpanded && (
					<p className="mt-4 text-xs text-text-muted font-mono leading-relaxed bg-bg-page rounded-xl p-4 border border-border shadow-inner">
						{product.rawText || "No additional text data available."}
					</p>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
