import { useMemo } from "react";
import { DownloadIcon, EditIcon, FileIcon, ViewIcon } from "@/assets";
import { Button, IconButton } from "@/components/button";
import type { BillDetail } from "@/types/bill";
import { getBillDate, getFileName, getTotalAmount, getVendor } from "../utils";

interface BillSummaryViewProps {
	bill: BillDetail;
	onEdit?: () => void;
}

const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

const BillSummaryView: React.FC<BillSummaryViewProps> = (props) => {
	const { bill, onEdit } = props;
	const files = bill.files || [];

	const { totalAmount, billDate, vendor } = useMemo(() => {
		const totalAmount = getTotalAmount(bill.products);
		const billDate = getBillDate(bill.products);
		const vendor = getVendor(bill.products);

		return { totalAmount, billDate, vendor };
	}, [bill.products]);

	const handleEdit = () => {
		onEdit?.();
	};

	const handleView = (url: string) => {
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const handleDownload = (url: string, fileName: string) => {
		const link = document.createElement("a");
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="lg:w-80 xl:w-96 shrink-0">
			<div className="sticky top-24 flex flex-col gap-8">
				{/* Summary card */}
				<div className="bg-bg-card rounded-2xl border border-border p-8 shadow-md">
					<div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
						<h3 className="text-xl font-bold text-text-heading">
							Bill Summary
						</h3>
					</div>

					<div className="space-y-6">
						<div>
							<p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
								Total Amount
							</p>
							<p className="text-2xl font-black text-text-heading leading-none">
								₹
								{totalAmount.toLocaleString("en-IN", {
									minimumFractionDigits: 2,
								})}
							</p>
						</div>
						<div>
							<p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
								Bill Date
							</p>
							<p className="text-sm font-bold text-text-body">{billDate}</p>
						</div>
						<div>
							<p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
								Vendor
							</p>
							<p className="text-sm font-bold text-text-body leading-snug">
								{vendor}
							</p>
						</div>

						<div className="space-y-3">
							<p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
								Attached Documents ({files.length})
							</p>
							{files.map((file: string) => {
								const fileName = getFileName(file);
								const fileUrl = `${CLOUDFRONT_DOMAIN}/${file}`;
								return (
									<div
										key={file}
										className="flex items-center gap-4 p-2 rounded-2xl bg-bg-page border border-border shadow-inner group"
									>
										<div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 border border-amber-200">
											<FileIcon />
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-[14px] font-bold text-text-body truncate mb-0.5">
												{fileName}
											</p>
											<p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
												PDF DOCUMENT
											</p>
										</div>
										<div className="flex gap-1">
											<IconButton
												icon={<ViewIcon />}
												onClick={() => handleView(fileUrl)}
												tooltip="View"
											/>
											<IconButton
												icon={<DownloadIcon />}
												onClick={() => handleDownload(fileUrl, fileName)}
												tooltip="Download"
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="mt-10 flex flex-col gap-3 pt-8 border-t border-border">
						<Button
							label="Edit Bill Data"
							variant="primary"
							fullWidth
							onClick={handleEdit}
							icon={<EditIcon />}
							iconPosition="start"
							className="py-3 shadow-lg shadow-blue-500/20"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BillSummaryView;
