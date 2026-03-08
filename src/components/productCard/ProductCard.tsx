import { useState } from "react";
import { IconButton } from "@/components/button";
import type { Product } from "@/types/bill";

interface ProductCardProps {
	product: Product;
	onEdit: () => void;
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
	const [rawExpanded, setRawExpanded] = useState(false);

	return (
		<div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xs hover:shadow-sm transition-shadow">
			<div className="flex items-center justify-between pb-5 mb-5 border-b border-[var(--color-border)]">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-[var(--color-border)]">
						{product.image ? (
							<img
								src={product.image}
								alt={product.name}
								className="w-12 h-12 rounded-xl object-cover"
							/>
						) : (
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--color-text-muted)"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
								<line x1="8" y1="21" x2="16" y2="21" />
								<line x1="12" y1="17" x2="12" y2="21" />
							</svg>
						)}
					</div>
					<h3 className="text-lg font-bold text-[var(--color-text-heading)]">
						{product.name}
					</h3>
				</div>
				<IconButton
					icon={
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
					}
					tooltip="Edit this product"
					onClick={onEdit}
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
				{/* Left column */}
				<div className="flex flex-col gap-5">
					<div>
						<p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-3 opacity-80">
							Product Information
						</p>
						<dl className="space-y-3">
							{[
								{ label: "Model Number", value: product.modelNumber },
								{ label: "Serial Number", value: product.serialNumber },
								{ label: "Product Name", value: product.productName },
							].map(({ label, value }) => (
								<div key={label}>
									<dt className="text-xs text-[var(--color-text-muted)] font-medium mb-0.5">
										{label}
									</dt>
									<dd className="text-sm text-[var(--color-text-body)] font-semibold leading-relaxed">
										{value || "—"}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div>
						<p className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-3 opacity-80">
							Vendor Information
						</p>
						<dl className="space-y-3">
							<div>
								<dt className="text-xs text-[var(--color-text-muted)] font-medium mb-0.5">
									Name
								</dt>
								<dd className="text-sm text-[var(--color-text-body)] font-semibold">
									{product.vendorName || "—"}
								</dd>
							</div>
							<div>
								<dt className="text-xs text-[var(--color-text-muted)] font-medium mb-0.5">
									Address
								</dt>
								<dd className="text-sm text-[var(--color-text-body)] font-semibold leading-relaxed">
									{product.vendorAddress || "—"}
								</dd>
							</div>
						</dl>
					</div>
				</div>

				{/* Right column */}
				<div className="flex flex-col gap-5">
					<div>
						<p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-3 opacity-80">
							Purchase Details
						</p>
						<dl className="space-y-3">
							{[
								{ label: "Purchase Date", value: product.purchaseDate },
								{ label: "Base Price", value: product.basePrice },
								{ label: "GST (6%)", value: product.gst },
								{ label: "Payment Mode", value: product.paymentMode },
							].map(({ label, value }) => (
								<div
									key={label}
									className="flex justify-between items-center py-1 border-b border-[var(--color-border)] border-dashed last:border-0"
								>
									<dt className="text-xs text-[var(--color-text-muted)] font-medium">
										{label}
									</dt>
									<dd className="text-sm text-[var(--color-text-body)] font-semibold">
										{value || "—"}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div>
						<p className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-3 opacity-80">
							Warranty Status
						</p>
						<dl className="space-y-3">
							<div className="flex justify-between items-center py-1 border-b border-[var(--color-border)] border-dashed">
								<dt className="text-xs text-[var(--color-text-muted)] font-medium">
									Start Date
								</dt>
								<dd className="text-sm text-[var(--color-text-body)] font-semibold">
									{product.warrantyStart || "—"}
								</dd>
							</div>
							<div className="flex justify-between items-center py-1">
								<dt className="text-xs text-[var(--color-text-muted)] font-medium">
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
									{product.warrantyEnd || "—"}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>

			{/* Remaining Raw Text (collapsible) */}
			<div className="mt-6 pt-5 border-t border-[var(--color-border)]">
				<button
					type="button"
					onClick={() => setRawExpanded((v) => !v)}
					className="flex items-center justify-between w-full text-sm text-[var(--color-text-body)] font-bold cursor-pointer hover:text-[var(--color-primary)] transition-colors py-2"
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
					<p className="mt-4 text-xs text-[var(--color-text-muted)] font-mono leading-relaxed bg-[var(--color-bg-page)] rounded-xl p-4 border border-[var(--color-border)] shadow-inner">
						{product.rawText || "No additional text data available."}
					</p>
				)}
			</div>
		</div>
	);
}
