import { useState } from "react";
import { EditIcon, ProductIcon } from "@/assets";
import { IconButton } from "@/components/button";
import type { Product } from "@/types/bill";

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
					<div>
						<p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 opacity-80">
							Product Information
						</p>
						<dl className="space-y-3">
							{[
								{ label: "Product Name", value: product.productName },
								{ label: "Model Number", value: product.modelNumber },
								{ label: "Serial Number", value: product.serialNumber },
								{
									label: "Last Updated",
									value: product.lastUpdated
										? new Date(product.lastUpdated).toLocaleDateString()
										: null,
								},
							].map(({ label, value }) => (
								<div key={label}>
									<dt className="text-xs text-text-muted font-medium mb-0.5">
										{label}
									</dt>
									<dd className="text-sm text-text-body font-semibold leading-relaxed">
										{value != null && value !== "" ? value : "NA"}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div>
						<p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 opacity-80">
							Vendor Information
						</p>
						<dl className="space-y-3">
							<div>
								<dt className="text-xs text-text-muted font-medium mb-0.5">
									Name
								</dt>
								<dd className="text-sm text-text-body font-semibold">
									{product.vendorName || "NA"}
								</dd>
							</div>
							<div>
								<dt className="text-xs text-text-muted font-medium mb-0.5">
									Contact
								</dt>
								<dd className="text-sm text-text-body font-semibold">
									{product.vendorContact || "NA"}
								</dd>
							</div>
							<div>
								<dt className="text-xs text-text-muted font-medium mb-0.5">
									Address
								</dt>
								<dd className="text-sm text-text-body font-semibold leading-relaxed">
									{product.vendorAddress || "NA"}
								</dd>
							</div>
						</dl>
					</div>
				</div>

				{/* Right column */}
				<div className="flex flex-col gap-5">
					<div>
						<p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 opacity-80">
							Purchase Details
						</p>
						<dl className="space-y-3">
							{[
								{ label: "Purchaser Name", value: product.purchaserName },
								{ label: "Purchase Date", value: product.purchaseDate },
								{ label: "Base Price", value: product.basePrice },
								{
									label: `GST (${product.gstPercent != null ? product.gstPercent : "NA"}%)`,
									value: product.gstAmount,
								},
								{ label: "Payment Mode", value: product.paymentMode },
							].map(({ label, value }) => (
								<div
									key={label}
									className="flex justify-between items-center py-1 border-b border-border border-dashed last:border-0"
								>
									<dt className="text-xs text-text-muted font-medium">
										{label}
									</dt>
									<dd className="text-sm text-text-body font-semibold">
										{value != null && value !== "" ? value : "NA"}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div>
						<p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 opacity-80">
							Warranty Status
						</p>
						<dl className="space-y-3">
							<div className="flex justify-between items-center py-1 border-b border-border border-dashed">
								<dt className="text-xs text-text-muted font-medium">
									Start Date
								</dt>
								<dd className="text-sm text-text-body font-semibold">
									{product.warrantyStart || "NA"}
								</dd>
							</div>
							<div className="flex justify-between items-center py-1">
								<dt className="text-xs text-text-muted font-medium">
									End Date
								</dt>
								<dd
									className="text-sm font-bold"
									style={{
										color:
											product.warrantyEnd &&
											new Date(product.warrantyEnd) > new Date()
												? "var(--color-success)"
												: "var(--color-error)",
									}}
								>
									{product.warrantyEnd || "NA"}
								</dd>
							</div>
						</dl>
					</div>
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
