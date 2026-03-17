import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { EditIcon, FileIcon, PlusIcon, ProductIcon, TrashIcon } from "@/assets";
import { Button, IconButton } from "@/components/button";
import { DateInput, NumberInput, TextArea, TextInput } from "@/components/form";
import { useHttp } from "@/hooks/useHttp";
import type { ValidationRule } from "@/types";
import type { BillDetail, Product } from "@/types/bill";
import { getBillDate, getFileName, getTotalAmount, getVendor } from "../utils";

interface EditViewProps {
	bill: BillDetail;
	onCancel: () => void;
	onSave: (data: BillDetail) => void;
}

// TODO : FIX PRODUCT DATA POINTS READS

const EditView: React.FC<EditViewProps> = (props) => {
	const { bill, onCancel, onSave } = props;

	const http = useHttp();
	const [formData, setFormData] = useState<BillDetail>(bill);
	const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>(
		{},
	);
	const [deletedFile, setDeletedFile] = useState<string[]>([]);
	const [filesAdded, setFilesAdded] = useState<File[]>([]);

	const { totalAmount, billDate, vendor } = useMemo(() => {
		const totalAmount = getTotalAmount(bill.products);
		const billDate = getBillDate(bill.products);
		const vendor = getVendor(bill.products);

		return { totalAmount, billDate, vendor };
	}, [bill.products]);

	const isFormValid = Object.values(fieldValidity).every(Boolean);

	const mutation = useMutation({
		mutationFn: (data: BillDetail) =>
			http.put(`/bills/${bill.id}`, data).then((r) => r.data as BillDetail),
		onSuccess: (data) => onSave(data),
	});

	const handleValidationChange = (name: string, valid: boolean) => {
		setFieldValidity((prev) => ({ ...prev, [name]: valid }));
	};

	const updateProduct = (index: number, field: keyof Product, value: any) => {
		setFormData((prev) => {
			const newProducts = [...prev.products];
			newProducts[index] = { ...newProducts[index], [field]: value };
			return { ...prev, products: newProducts };
		});
	};

	const handleSave = () => {
		// Log the complete object being submitted
		console.log("Submitting complete object:", formData);

		// Calculate changed fields
		const changedFields: any = {};

		// Diff Bill level fields
		(Object.keys(formData) as Array<keyof BillDetail>).forEach((key) => {
			if (key !== "products" && key !== "files") {
				if (formData[key] !== (bill as any)[key]) {
					changedFields[key] = formData[key];
				}
			}
		});

		// Diff Products
		const productChanges = formData.products
			.map((p, idx) => {
				const orig = bill.products[idx];
				const changes: any = {};
				(Object.keys(p) as Array<keyof Product>).forEach((k) => {
					if (orig && p[k] !== (orig as any)[k]) {
						changes[k] = p[k];
					} else if (!orig) {
						changes[k] = p[k];
					}
				});
				return Object.keys(changes).length > 0
					? { id: p.id, ...changes }
					: null;
			})
			.filter(Boolean);

		if (productChanges.length > 0) {
			changedFields.products = productChanges;
		}

		// Include file changes in changedFields log
		if (deletedFile.length > 0) {
			changedFields.deletedFiles = deletedFile;
		}
		if (filesAdded.length > 0) {
			changedFields.addedFiles = filesAdded.map((f) => f.name);
		}

		// Log only fields whose value is changed
		console.log("Changed values only:", changedFields);

		// mutation.mutate(formData);
	};

	const requiredText: ValidationRule[] = [
		{ type: "required", message: "This field is required" },
	];

	const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Editing banner */}
			<div className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-bold tracking-widest shadow-sm">
				<EditIcon />
				EDITING MODE
			</div>

			<h1 className="text-3xl font-extrabold text-text-heading mb-2">
				Edit Bill Details
			</h1>
			<p className="text-base text-text-muted mb-10 leading-relaxed">
				Modify data from{" "}
				<span className="text-text-body font-semibold">
					Bill ({bill.products.length} Products)
				</span>{" "}
			</p>

			<div className="flex flex-col lg:flex-row gap-10">
				{/* Left Column: Bill & Products */}
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
								<div className="space-y-8">
									<div>
										<p className="text-xs font-bold text-primary uppercase tracking-widest mb-6 opacity-80">
											General Information
										</p>
										<div className="flex flex-col gap-6">
											<TextArea
												name={`${idx}-productName`}
												label="Product Name"
												value={product.productName || ""}
												onChange={(v) => updateProduct(idx, "productName", v)}
												onValidationChange={handleValidationChange}
												rows={2}
												validations={requiredText}
												required
											/>
											<div className="grid grid-cols-2 gap-4">
												<TextInput
													name={`${idx}-modelNumber`}
													label="Model Number"
													value={product.modelNumber || ""}
													onChange={(v) => updateProduct(idx, "modelNumber", v)}
												/>
												<TextInput
													name={`${idx}-serialNumber`}
													label="Serial Number"
													value={product.serialNumber || ""}
													onChange={(v) =>
														updateProduct(idx, "serialNumber", v)
													}
												/>
											</div>
											<TextInput
												name={`${idx}-purchaserName`}
												label="Purchaser Name"
												value={product.purchaserName || ""}
												onChange={(v) => updateProduct(idx, "purchaserName", v)}
											/>
										</div>
									</div>

									<div>
										<p className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 opacity-80">
											Vendor Information
										</p>
										<div className="flex flex-col gap-6">
											<TextInput
												name={`${idx}-vendorName`}
												label="Vendor Name"
												value={product.vendorName || ""}
												onChange={(v) => updateProduct(idx, "vendorName", v)}
											/>
											<TextInput
												name={`${idx}-vendorContact`}
												label="Vendor Contact"
												value={product.vendorContact || ""}
												onChange={(v) => updateProduct(idx, "vendorContact", v)}
											/>
											<TextArea
												name={`${idx}-vendorAddress`}
												label="Vendor Address"
												value={product.vendorAddress || ""}
												onChange={(v) => updateProduct(idx, "vendorAddress", v)}
												rows={2}
											/>
										</div>
									</div>
								</div>

								{/* Dates & Financials */}
								<div className="space-y-8">
									<div>
										<p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-6 opacity-80">
											Dates
										</p>
										<div className="flex flex-col gap-6">
											<div className="grid grid-cols-2 gap-4">
												<DateInput
													name={`${idx}-purchaseDate`}
													label="Purchase Date"
													value={product.purchaseDate || ""}
													onChange={(v) =>
														updateProduct(idx, "purchaseDate", v)
													}
													onValidationChange={handleValidationChange}
													validations={requiredText}
													required
												/>
												<DateInput
													name={`${idx}-lastUpdated`}
													label="Last Updated"
													value={product.lastUpdated || ""}
													onChange={(v) => updateProduct(idx, "lastUpdated", v)}
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<DateInput
													name={`${idx}-warrantyStart`}
													label="Warranty Start"
													value={product.warrantyStart || ""}
													onChange={(v) =>
														updateProduct(idx, "warrantyStart", v)
													}
												/>
												<DateInput
													name={`${idx}-warrantyEnd`}
													label="Warranty End"
													value={product.warrantyEnd || ""}
													onChange={(v) => updateProduct(idx, "warrantyEnd", v)}
												/>
											</div>
										</div>
									</div>

									<div>
										<p className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 opacity-80">
											Financials & Registry
										</p>
										<div className="flex flex-col gap-6">
											<NumberInput
												name={`${idx}-basePrice`}
												label="Base Price"
												value={product.basePrice?.toString() || ""}
												onChange={(v) =>
													updateProduct(
														idx,
														"basePrice",
														v === "" ? undefined : Number(v),
													)
												}
												validations={[
													{
														type: "min",
														value: 0,
														message: "Price cannot be negative",
													},
												]}
											/>
											<div className="grid grid-cols-2 gap-4">
												<NumberInput
													name={`${idx}-gstPercent`}
													label="GST %"
													value={product.gstPercent?.toString() || ""}
													onChange={(v) =>
														updateProduct(
															idx,
															"gstPercent",
															v === "" ? undefined : Number(v),
														)
													}
												/>
												<NumberInput
													name={`${idx}-gstAmount`}
													label="GST Amount"
													value={product.gstAmount?.toString() || ""}
													onChange={(v) =>
														updateProduct(
															idx,
															"gstAmount",
															v === "" ? undefined : Number(v),
														)
													}
												/>
											</div>
											<TextInput
												name={`${idx}-paymentMode`}
												label="Payment Mode"
												value={product.paymentMode || ""}
												onChange={(v) => updateProduct(idx, "paymentMode", v)}
											/>
										</div>
									</div>
								</div>
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

				{/* Right: Bill Summary */}
				<div className="lg:w-80 xl:w-96 shrink-0">
					<div className="sticky top-24 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] p-8 shadow-md">
						<div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]">
							<h3 className="text-xl font-bold text-[var(--color-text-heading)]">
								Documents Uploaded
							</h3>
						</div>
						<div className="space-y-6">
							<div>
								<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
									Total Amount
								</p>
								<p className="text-2xl font-black text-[var(--color-text-heading)]">
									{totalAmount || "0.00"}
								</p>
							</div>
							<div>
								<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
									Bill Date
								</p>
								<p className="text-sm font-bold text-[var(--color-text-body)]">
									{billDate || "NA"}
								</p>
							</div>
							<div>
								<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
									Vendor
								</p>
								<p className="text-sm font-bold text-[var(--color-text-body)]">
									{vendor || "NA"}
								</p>
							</div>

							<div className="space-y-3">
								<p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
									Attached Documents ({bill.files?.length || 0})
								</p>
								<div className="flex flex-col gap-2">
									{bill.files?.map((file) => {
										const fileName = getFileName(file);
										const isDeleted = deletedFile.includes(file);
										return (
											<div
												key={file}
												className={`flex items-center gap-4 p-2 rounded-2xl border transition-all duration-200 ${
													isDeleted
														? "bg-red-50 border-red-200"
														: "bg-bg-page border-border shadow-inner"
												}`}
											>
												<div
													className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
														isDeleted
															? "bg-red-100 border-red-200"
															: "bg-amber-100 border-amber-200"
													}`}
												>
													<FileIcon />
												</div>
												<div className="min-w-0 flex-1">
													<p
														className={`text-sm font-bold truncate mb-0.5 ${
															isDeleted ? "text-red-700" : "text-text-body"
														}`}
													>
														{fileName}
													</p>
													<p
														className={`text-[9px] font-bold uppercase tracking-widest ${
															isDeleted ? "text-red-400" : "text-text-muted"
														}`}
													>
														PDF DOCUMENT
													</p>
												</div>
												{!isDeleted && (
													<IconButton
														icon={<TrashIcon className="text-red-500" />}
														onClick={() =>
															setDeletedFile((prev) => [...prev, file])
														}
														tooltip="Mark for deletion"
													/>
												)}
												{isDeleted && (
													<IconButton
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
																<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
															</svg>
														}
														onClick={() =>
															setDeletedFile((prev) =>
																prev.filter((f) => f !== file),
															)
														}
														tooltip="Undo delete"
														className="text-red-500"
													/>
												)}
											</div>
										);
									})}

									{/* Render newly added files */}
									{filesAdded.map((file) => (
										<div
											key={`${file.name}-${file.lastModified}`}
											className="flex items-center gap-4 p-2 rounded-2xl bg-green-50 border border-green-200 shadow-inner"
										>
											<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 border border-green-200 text-green-600">
												<FileIcon />
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-sm font-bold text-green-800 truncate mb-0.5">
													{file.name}
												</p>
												<p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
													NEW FILE
												</p>
											</div>
											<IconButton
												icon={<TrashIcon className="text-red-500" />}
												onClick={() =>
													setFilesAdded((prev) =>
														prev.filter((f) => f !== file),
													)
												}
												tooltip="Remove"
											/>
										</div>
									))}
								</div>

								<div className="mt-4">
									<input
										type="file"
										multiple
										id="add-file-input"
										className="hidden"
										onChange={(e) => {
											const selectedFiles = e.target.files;
											if (selectedFiles) {
												setFilesAdded((prev) => [
													...prev,
													...Array.from(selectedFiles),
												]);
											}
										}}
									/>
									<Button
										label="Add File"
										variant="secondary"
										fullWidth
										className="py-2 border-dashed border-2 hover:border-primary border-border"
										icon={<PlusIcon />}
										onClick={() =>
											document.getElementById("add-file-input")?.click()
										}
									/>
								</div>
							</div>
						</div>

						<div className="mt-10 flex flex-col gap-3 pt-8 border-t border-border">
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
								onClick={handleSave}
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
