import React from "react";
import { Button } from "@/components/button";
import type { BillDetail } from "@/types/bill";
import { BasicInfo, FilesInfo } from "./components";

interface RightViewProps {
	bill: BillDetail;
	formData: BillDetail;
	totalAmount: string | number;
	billDate: string;
	vendor: string;
	deletedFile: string[];
	filesAdded: any[];
	setDeletedFile: React.Dispatch<React.SetStateAction<string[]>>;
	setFilesAdded: React.Dispatch<React.SetStateAction<any[]>>;
	isPending: boolean;
	onCancel: () => void;
	onSave: () => void;
	isFormValid: boolean;
	handleSave: () => Promise<void>;
}

const RightView: React.FC<RightViewProps> = ({
	bill,
	formData,
	totalAmount,
	billDate,
	vendor,
	deletedFile,
	filesAdded,
	setDeletedFile,
	setFilesAdded,
	isPending,
	onCancel,
	onSave,
	isFormValid,
	handleSave,
}) => {
	return (
		<div className="lg:w-80 xl:w-96 shrink-0">
			<div className="sticky top-24 bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] p-8 shadow-md">
				<div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]">
					<h3 className="text-xl font-bold text-[var(--color-text-heading)]">
						Documents Uploaded
					</h3>
				</div>
				<div className="space-y-6">
					<BasicInfo
						totalAmount={totalAmount}
						billDate={billDate}
						vendor={vendor}
					/>

					<FilesInfo
						bill={bill}
						formData={formData}
						deletedFile={deletedFile}
						filesAdded={filesAdded}
						setDeletedFile={setDeletedFile}
						setFilesAdded={setFilesAdded}
						isPending={isPending}
					/>

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
	);
};

export default RightView;
