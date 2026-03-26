import { useMemo, useState } from "react";
import {
	EditIcon,
	FileIcon,
	PlusIcon,
	ProductIcon,
	ResyncIcon,
	TrashIcon,
} from "@/assets";
import { Button, IconButton } from "@/components/button";
import { DateInput, NumberInput, TextArea, TextInput } from "@/components/form";
import type { ValidationRule } from "@/types";
import type { BillDetail, Product } from "@/types/bill";
import useUpdateBill, { type UpdFileI } from "./hooks/useUpdateBill";
import { getBillDate, getFileName, getTotalAmount, getVendor } from "./utils";

interface EditViewProps {
	bill: BillDetail;
	onCancel: () => void;
	onSave: () => void;
}

const requiredText: ValidationRule[] = [
	{ type: "required", message: "This field is required" },
];
const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

const EditView: React.FC<EditViewProps> = (props) => {
	const { bill, onCancel, onSave } = props;
	console.log("bill : ", bill);
	const [formData, setFormData] = useState<BillDetail>(bill);
	const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>(
		{},
	);
	const [deletedFile, setDeletedFile] = useState<string[]>([]);
	const [filesAdded, setFilesAdded] = useState<UpdFileI[]>([]);
	const { updateBill, isPending } = useUpdateBill();

	const { totalAmount, billDate, vendor } = useMemo(() => {
		const totalAmount = getTotalAmount(bill.products);
		const billDate = getBillDate(bill.products);
		const vendor = getVendor(bill.products);

		return { totalAmount, billDate, vendor };
	}, [bill.products]);

	const isFormValid = Object.values(fieldValidity).every(Boolean);

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

	const handleSave = async () => {
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
					? { id: p.id, SK: p.SK, ...changes }
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
			console.log("file added: ", filesAdded);
			// Iterate over filesAdded to only add details (File objects)
			changedFields.addedFiles = filesAdded.map((f) => {
				return {
					details: f.details,
					products: f.products,
				};
			});
		}

		// Log only fields whose value is changed
		console.log("Changed values only:", changedFields);
		await updateBill({ billNo: bill.billNo, ...changedFields }).then(() => {
			onSave();
		});
	};

	return (
		<>
			{/* Editing banner */}
			<div className="mb-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-bold tracking-widest shadow-sm">
				<EditIcon />
				EDITING MODE
			</div>

			<h1 className="text-3xl font-extrabold text-text-heading mb-2">
				Edit Bill Details
			</h1>
			<p className="text-base text-text-muted mb-2 leading-relaxed">
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
											<div className="grid grid-cols-2 gap-4">
												<TextInput
													name={`${idx}-brand`}
													label="Brand"
													value={product.brand || ""}
													onChange={(v) => updateProduct(idx, "brand", v)}
												/>
												<TextInput
													name={`${idx}-category`}
													label="Category"
													value={product.category || ""}
													onChange={(v) => updateProduct(idx, "category", v)}
												/>
											</div>
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
														icon={<ResyncIcon />}
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
									{filesAdded.map((file, additionIdx) => (
										<div
											key={`${file.details.name}-${file.details.size}-${file.details.lastModified}`}
											className="flex flex-col gap-4 p-4 rounded-2xl bg-green-50 border border-green-200 shadow-inner"
										>
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 border border-green-200 text-green-600">
													<FileIcon />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-bold text-green-800 truncate mb-0.5">
														{file.details.name}
													</p>
													<p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
														NEW FILE
													</p>
												</div>
												<IconButton
													icon={<TrashIcon className="text-red-500" />}
													onClick={() =>
														setFilesAdded((prev) =>
															prev.filter((_, i) => i !== additionIdx),
														)
													}
													tooltip="Remove"
												/>
											</div>

											{/* Product Selection for new file */}
											<div className="flex flex-col gap-1.5 ml-14">
												<label
													htmlFor={`product-select-${additionIdx}`}
													className="text-[10px] font-black uppercase tracking-widest text-green-600"
												>
													Link to Product <span className="text-error">*</span>
												</label>
												<select
													id={`product-select-${additionIdx}`}
													className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-sm font-medium text-text-body focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
													value={file.products[0]?.SK || ""}
													onChange={(e) => {
														const selectedSK = e.target.value;
														const product = formData.products.find(
															(p: Product & { SK?: string }) =>
																p.SK === selectedSK,
														) as (Product & { SK: string }) | undefined;
														if (product) {
															setFilesAdded((prev) => {
																const next = [...prev];
																next[additionIdx] = {
																	...next[additionIdx],
																	products: [
																		{
																			name: product.productName || "Unknown",
																			SK: selectedSK,
																		},
																	],
																};
																return next;
															});
														} else {
															// Reset if needed
															setFilesAdded((prev) => {
																const next = [...prev];
																next[additionIdx] = {
																	...next[additionIdx],
																	products: [],
																};
																return next;
															});
														}
													}}
													required
												>
													<option value="">Select a product...</option>
													{formData.products.map(
														(p: Product & { SK?: string }) => (
															<option
																key={p.SK || p.id || p.productName}
																value={p.SK}
															>
																{p.productName || "Unnamed Product"}
															</option>
														),
													)}
												</select>
											</div>
										</div>
									))}
								</div>

								<div className="mt-4">
									<input
										type="file"
										multiple
										disabled={isPending}
										id="add-file-input"
										className="hidden"
										onChange={(e) => {
											const selectedFiles = e.target.files;
											if (selectedFiles) {
												setFilesAdded((prev) => [
													...prev,
													...Array.from(selectedFiles).map((f) => ({
														details: f,
														products: [],
													})),
												]);
											}
										}}
									/>
									<Button
										label="Add File"
										variant="secondary"
										fullWidth
										disabled={isPending}
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
								disabled={isPending}
								fullWidth
								onClick={onCancel}
								className="py-3"
							/>
							<Button
								label="Save Changes"
								variant="primary"
								fullWidth
								disabled={
									!isFormValid ||
									filesAdded.some((f) => f.products.length === 0) ||
									isPending
								}
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
		</>
	);
};

export default EditView;
