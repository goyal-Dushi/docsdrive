import { Button } from "@/components/button";
import type { BillDetail } from "@/types/bill";

interface BillSummaryViewProps {
	bill: BillDetail;
	onEdit?: () => void;
}

const BillSummaryView: React.FC<BillSummaryViewProps> = (props) => {
	const { bill, onEdit } = props;

	const handleEdit = () => {
		onEdit?.();
	};

	return (
		<div className="lg:w-80 xl:w-96 shrink-0">
			<div className="sticky top-24 flex flex-col gap-8">
				{/* Summary card */}
				<div className="bg-bg-card rounded-2xl border border-border p-8 shadow-md">
					<div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
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
								{bill.totalAmount}
							</p>
						</div>
						<div>
							<p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
								Bill Date
							</p>
							<p className="text-sm font-bold text-text-body">
								{bill.billDate}
							</p>
						</div>
						<div>
							<p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
								Vendor
							</p>
							<p className="text-sm font-bold text-text-body leading-snug">
								{bill.vendor}
							</p>
						</div>

						<div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-page border border-border shadow-inner">
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
								<p className="text-xs font-bold text-text-body truncate">
									{bill.pdfName}
								</p>
								<p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">
									{bill.pdfSize} • PDF DOCUMENT
								</p>
							</div>
						</div>
					</div>

					<div className="mt-10 flex flex-col gap-3 pt-8 border-t border-border">
						<Button
							label="View Original PDF"
							variant="secondary"
							fullWidth
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
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							}
							iconPosition="start"
							className="py-3"
						/>
						<Button
							label="Edit Bill Data"
							variant="primary"
							fullWidth
							onClick={handleEdit}
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
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
								</svg>
							}
							iconPosition="start"
							className="py-3 shadow-lg shadow-blue-500/20"
						/>
					</div>
				</div>

				{/* AI Verification Banner */}
				<div className="bg-info-bg rounded-2xl border border-info p-6">
					<div className="flex gap-3">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-info)"
							strokeWidth="2.5"
							className="shrink-0"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
							<path d="M9 12l2 2 4-4" />
						</svg>
						<div>
							<p className="text-sm font-bold text-info mb-1 uppercase tracking-tight">
								AI Verified
							</p>
							<p className="text-xs text-text-body font-medium leading-relaxed">
								Extracted data has been verified against the original document
								for accuracy.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BillSummaryView;
