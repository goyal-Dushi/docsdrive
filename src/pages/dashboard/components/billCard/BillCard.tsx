import { ChatIcon, TrashIcon, ViewIcon } from "@/assets";
import { Button, IconButton } from "@/components/button";
import { formatDate } from "@/utils";
import useBillDelete from "../../hooks/useBillDelete";
import ProductRow from "./ProductRow";
import type { Bill } from "./types";

interface BillCardProps {
	bill: Bill;
	onChat: () => void;
	onView: () => void;
}

const BillCard: React.FC<BillCardProps> = (props) => {
	const { bill, onChat, onView } = props;
	const { billNo, lastUpdated, products, purchaseDate, vendor, status } = bill;
	const { mutateAsync: deleteBill, isPending } = useBillDelete();

	const handleBillDelete = async () => {
		await deleteBill(billNo);
	};

	return (
		<div className="bg-bg-card rounded-3xl border border-border p-8 flex flex-col gap-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="flex flex-col gap-1">
							<h3 className="text-xl font-black text-text-heading leading-tight group-hover:text-primary transition-colors">
								{vendor}
							</h3>
							{purchaseDate && (
								<p className="text-xs text-text-muted font-bold uppercase tracking-widest">
									Purchased {formatDate(purchaseDate)}
								</p>
							)}
						</div>

						<IconButton
							icon={<TrashIcon width={16} height={16} />}
							tooltip="Delete Bill"
							onClick={handleBillDelete}
							disabled={isPending}
							className="hover:text-red-500 hover:bg-red-0 p-1 shrink-0"
						/>
					</div>

					<div className="mt-4 flex items-center gap-3 text-[10px] text-text-muted/60 font-black uppercase tracking-widest border-t border-border/50 pt-3">
						<span>#{billNo}</span>
						<span className="w-1 h-1 rounded-full bg-border" />
						<span>Updated {formatDate(lastUpdated)}</span>
					</div>
				</div>
				{status === "DONE" && (
					<span className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest bg-success-bg text-success border border-success shadow-sm">
						PROCESSED
					</span>
				)}
			</div>

			<div className="flex-1 flex flex-col gap-3">
				{products.map((product) => {
					return <ProductRow product={product} key={product.productName} />;
				})}
			</div>

			<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border border-dashed">
				<Button
					label="Chat with AI"
					variant="primary"
					icon={<ChatIcon />}
					iconPosition="start"
					onClick={onChat}
					className="flex-1 py-3"
				/>
				<Button
					label="View Details"
					variant="secondary"
					icon={<ViewIcon />}
					iconPosition="start"
					onClick={onView}
					className="flex-1 py-3"
				/>
			</div>
		</div>
	);
};

export default BillCard;
