import type { FC } from "react";
import { formatDate } from "@/utils";
import type { BillProduct } from "./types";
import { ChevronDown } from "lucide-react";

interface BillSummaryHeaderProps {
	primaryProduct: BillProduct;
	isExpanded: boolean;
	onToggle: () => void;
}

const isWarrantyExpired = (date: string) => {
	return new Date(date) < new Date();
};

const BillSummaryHeader: FC<BillSummaryHeaderProps> = ({
	primaryProduct,
	isExpanded,
	onToggle,
}) => {
	const expired = primaryProduct.warrantyEnd ? isWarrantyExpired(primaryProduct.warrantyEnd) : false;

	return (
		<div
			className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
			onClick={onToggle}
		>
			<div className="flex items-center gap-2 min-w-0 flex-1">
				<h3 className="font-semibold text-sm text-gray-900 truncate flex-1">
					{primaryProduct.productName || "Unnamed Product"}
				</h3>

				{primaryProduct.warrantyEnd && (
					<div
						className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
							expired
								? "bg-red-100 text-red-700"
								: "bg-emerald-100 text-emerald-700"
						}`}
					>
						Warranty: {formatDate(primaryProduct.warrantyEnd)}
					</div>
				)}
			</div>

			<div
				className={`text-gray-400 transition-transform duration-300 ${
					isExpanded ? "rotate-180" : ""
				}`}
			>
				<span className="inline-block">
					<ChevronDown size={16} />
				</span>
			</div>
		</div>
	);
};

export default BillSummaryHeader;
