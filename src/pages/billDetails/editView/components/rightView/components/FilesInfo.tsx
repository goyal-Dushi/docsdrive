import React from "react";
import { FileIcon, PlusIcon, ResyncIcon, TrashIcon } from "@/assets";
import { Button, IconButton } from "@/components/button";
import type { BillDetail, Product } from "@/types/bill";
import { getFileName } from "../../../../utils";

interface FilesInfoProps {
	bill: BillDetail;
	formData: BillDetail;
	deletedFile: string[];
	filesAdded: any[];
	setDeletedFile: React.Dispatch<React.SetStateAction<string[]>>;
	setFilesAdded: React.Dispatch<React.SetStateAction<any[]>>;
	isPending: boolean;
}

const FilesInfo: React.FC<FilesInfoProps> = ({
	bill,
	formData,
	deletedFile,
	filesAdded,
	setDeletedFile,
	setFilesAdded,
	isPending,
}) => {
	return (
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
	);
};

export default FilesInfo;
