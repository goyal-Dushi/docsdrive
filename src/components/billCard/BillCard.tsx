import { Button } from "@/components/button";
import type { Bill } from "./types";

interface BillCardProps {
	bill: Bill;
	onChat: () => void;
	onView: () => void;
}

export function BillCard({ bill, onChat, onView }: BillCardProps) {
	return (
		<div className="bg-(--color-bg-card) rounded-3xl border border-(--color-border) p-8 flex flex-col gap-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<h3 className="text-xl font-black text-(--color-text-heading) leading-tight group-hover:text-(--color-primary) transition-colors">
						{bill.vendor}
					</h3>
					<p className="text-sm text-(--color-text-muted) font-bold mt-1 uppercase tracking-widest">
						Purchased {bill.date}
					</p>
				</div>
				{bill.status === "DONE" && (
					<span className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest bg-(--color-success-bg) text-(--color-success) border border-(--color-success) shadow-sm">
						PROCESSED
					</span>
				)}
			</div>

			<div className="flex-1">
				<p className="text-base text-(--color-text-body) font-medium leading-relaxed">
					{bill.description}
				</p>
				{!bill.hasWarranty && (
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-(--color-error-bg) text-(--color-error) text-[10px] font-black mt-4 uppercase tracking-widest border border-(--color-error) shadow-xs">
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						No Warranty Found
					</div>
				)}
			</div>

			<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-(--color-border) border-dashed">
				<Button
					label="Chat with AI"
					variant="primary"
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
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
					}
					iconPosition="start"
					onClick={onChat}
					className="flex-1 py-3"
				/>
				<Button
					label="View Details"
					variant="secondary"
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
					onClick={onView}
					className="flex-1 py-3"
				/>
			</div>
		</div>
	);
}
