import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/button";
import { DateInput, NumberInput, TextArea, TextInput } from "@/components/form";
import { useHttp } from "@/hooks/useHttp";
import type { ValidationRule } from "@/types";
import type { BillDetail, Product } from "@/types/bill";

interface EditViewProps {
	bill: BillDetail;
	onCancel: () => void;
	onSave: (data: BillDetail) => void;
}

const EditView: React.FC<EditViewProps> = (props) => {
	const { bill, onCancel, onSave } = props;

	const { http } = useHttp();
	const [formData, setFormData] = useState<BillDetail>(bill);
	const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>(
		{},
	);

	const isFormValid = Object.values(fieldValidity).every(Boolean);

	const mutation = useMutation({
		mutationFn: (data: BillDetail) =>
			http.put(`/bills/${bill.id}`, data).then((r) => r.data as BillDetail),
		onSuccess: (data) => onSave(data),
	});

	const handleValidationChange = (name: string, valid: boolean) => {
		setFieldValidity((prev) => ({ ...prev, [name]: valid }));
	};

	const updateProduct = (
		productId: string,
		field: keyof Product,
		value: string,
	) => {
		setFormData((prev) => ({
			...prev,
			products: prev.products.map((p) =>
				p.id === productId ? { ...p, [field]: value } : p,
			),
		}));
	};

	const requiredText: ValidationRule[] = [
		{ type: "required", message: "This field is required" },
	];

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Editing banner */}
			<div className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold tracking-widest shadow-sm">
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
				</svg>
				EDITING MODE
			</div>

			<h1 className="text-3xl font-extrabold text-text-heading mb-2">
				Edit Bill Details
			</h1>
			<p className="text-base text-text-muted mb-10 leading-relaxed">
				Modify extracted data from{" "}
				<span className="text-text-body font-semibold">
					Bill #{bill.billNumber}
				</span>{" "}
				for{" "}
				<span className="text-text-body font-semibold">'{bill.vendor}'</span>
			</p>

			<div className="flex flex-col lg:flex-row gap-10">
				{/* Left: Products */}
				<div className="flex-1 flex flex-col gap-8">
					<div className="flex items-center gap-3 py-2 border-b border-border">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-primary)"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<line x1="3" y1="9" x2="21" y2="9" />
							<line x1="9" y1="21" x2="9" y2="9" />
						</svg>
						<h2 className="text-xl font-bold text-text-heading">
							Extracted Products
						</h2>
					</div>

					{formData.products.map((product) => (
						<div
							key={product.id}
							className="bg-bg-card rounded-2xl border border-border p-8 shadow-sm"
						>
							<div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
								<div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-[var(--color-border)]">
									{product.image ? (
										<img
											src={product.image}
											alt={product.name}
											className="w-12 h-12 rounded-xl object-cover"
										/>
									) : (
										<svg
											width="22"
											height="22"
											viewBox="0 0 24 24"
											fill="none"
											stroke="text-muted"
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
								<h3 className="text-lg font-bold text-text-heading opacity-90">
									{product.name}
								</h3>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
								<div className="space-y-8">
									<div>
										<p className="text-xs font-bold text-primary uppercase tracking-widest mb-6 opacity-80">
											Product Information
										</p>
										<div className="flex flex-col gap-6">
											<TextInput
												name={`${product.id}-modelNumber`}
												label="Model Number"
												value={product.modelNumber}
												onChange={(v) =>
													updateProduct(product.id, "modelNumber", v)
												}
												onValidationChange={handleValidationChange}
												validations={requiredText}
												required
											/>
											<TextInput
												name={`${product.id}-serialNumber`}
												label="Serial Number"
												value={product.serialNumber}
												onChange={(v) =>
													updateProduct(product.id, "serialNumber", v)
												}
												onValidationChange={handleValidationChange}
												validations={requiredText}
											/>
											<TextArea
												name={`${product.id}-productName`}
												label="Product Name"
												value={product.productName}
												onChange={(v) =>
													updateProduct(product.id, "productName", v)
												}
												onValidationChange={handleValidationChange}
												rows={3}
												validations={requiredText}
												required
											/>
										</div>
									</div>

									<div>
										<p className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 opacity-80">
											Vendor Information
										</p>
										<div className="flex flex-col gap-6">
											<TextInput
												name={`${product.id}-vendorName`}
												label="Vendor Name"
												value={product.vendorName}
												onChange={(v) =>
													updateProduct(product.id, "vendorName", v)
												}
												onValidationChange={handleValidationChange}
												validations={requiredText}
												required
											/>
											<TextArea
												name={`${product.id}-vendorAddress`}
												label="Vendor Address"
												value={product.vendorAddress}
												onChange={(v) =>
													updateProduct(product.id, "vendorAddress", v)
												}
												onValidationChange={handleValidationChange}
												rows={2}
												validations={requiredText}
											/>
										</div>
									</div>
								</div>

								<div className="space-y-8">
									<div>
										<p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-6 opacity-80">
											Purchase Details
										</p>
										<div className="flex flex-col gap-6">
											<DateInput
												name={`${product.id}-purchaseDate`}
												label="Purchase Date"
												value={product.purchaseDate}
												onChange={(v) =>
													updateProduct(product.id, "purchaseDate", v)
												}
												onValidationChange={handleValidationChange}
												validations={requiredText}
												required
											/>
											<NumberInput
												name={`${product.id}-basePrice`}
												label="Base Price"
												value={product.basePrice}
												onChange={(v) =>
													updateProduct(product.id, "basePrice", v)
												}
												onValidationChange={handleValidationChange}
												validations={[
													{ type: "required", message: "Price is required" },
													{
														type: "min",
														value: 0,
														message: "Price cannot be negative",
													},
												]}
												required
											/>
											<TextInput
												name={`${product.id}-gst`}
												label="GST (6%)"
												value={product.gst}
												onChange={(v) => updateProduct(product.id, "gst", v)}
												onValidationChange={handleValidationChange}
											/>
											<TextInput
												name={`${product.id}-paymentMode`}
												label="Payment Mode"
												value={product.paymentMode}
												onChange={(v) =>
													updateProduct(product.id, "paymentMode", v)
												}
												onValidationChange={handleValidationChange}
											/>
										</div>
									</div>

									<div>
										<p className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-6 opacity-80">
											Warranty Details
										</p>
										<div className="flex flex-col gap-6">
											<DateInput
												name={`${product.id}-warrantyStart`}
												label="Start Date"
												value={product.warrantyStart}
												onChange={(v) =>
													updateProduct(product.id, "warrantyStart", v)
												}
												onValidationChange={handleValidationChange}
												validations={requiredText}
												required
											/>
											<DateInput
												name={`${product.id}-warrantyEnd`}
												label="End Date"
												value={product.warrantyEnd}
												onChange={(v) =>
													updateProduct(product.id, "warrantyEnd", v)
												}
												onValidationChange={handleValidationChange}
												validations={requiredText}
												required
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-10 pt-8 border-t border-[var(--color-border)]">
								<TextArea
									name={`${product.id}-rawText`}
									label="Remaining Raw Text"
									value={product.rawText}
									onChange={(v) => updateProduct(product.id, "rawText", v)}
									onValidationChange={handleValidationChange}
									rows={4}
								/>
							</div>
						</div>
					))}
				</div>

				{/* Right: Bill Summary */}
				<div className="lg:w-80 xl:w-96 shrink-0">
					<div className="sticky top-24 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] p-8 shadow-md">
						<div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="var(--color-primary)"
								strokeWidth="2.5"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
							</svg>
							<h3 className="text-xl font-bold text-[var(--color-text-heading)]">
								Bill Summary
							</h3>
						</div>
						<div className="space-y-6">
							<div>
								<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
									Total Amount
								</p>
								<p className="text-2xl font-black text-[var(--color-text-heading)]">
									{formData.totalAmount}
								</p>
							</div>
							<div>
								<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
									Bill Date
								</p>
								<p className="text-sm font-bold text-[var(--color-text-body)]">
									{formData.billDate}
								</p>
							</div>
							<div>
								<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
									Vendor
								</p>
								<p className="text-sm font-bold text-[var(--color-text-body)]">
									{formData.vendor}
								</p>
							</div>

							<div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border)] shadow-inner">
								<div className="w-12 h-14 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#D97706"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
										<polyline points="14 2 14 8 20 8" />
									</svg>
								</div>
								<div className="min-w-0">
									<p className="text-xs font-bold text-[var(--color-text-body)] truncate">
										{formData.pdfName}
									</p>
									<p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">
										{formData.pdfSize} • PDF DOCUMENT
									</p>
								</div>
							</div>
						</div>

						<div className="mt-10 flex flex-col gap-3 pt-8 border-t border-[var(--color-border)]">
							<Button
								label="Cancel"
								variant="secondary"
								fullWidth
								onClick={onCancel}
								className="py-3"
							/>
							<Button
								label={mutation.isPending ? "Saving…" : "Save Changes"}
								variant="primary"
								fullWidth
								disabled={!isFormValid || mutation.isPending}
								onClick={() => mutation.mutate(formData)}
								icon={
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
										<polyline points="17 21 17 13 7 13 7 21" />
										<polyline points="7 3 7 8 15 8" />
									</svg>
								}
								iconPosition="start"
								className="py-3 shadow-lg shadow-blue-500/20"
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default EditView;
