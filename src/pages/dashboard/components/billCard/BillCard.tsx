import React, { useState } from "react";
import useBillDelete from "../../hooks/useBillDelete";
import type { Bill } from "./types";
import BillImageSection from "./BillImageSection";
import BillSummaryHeader from "./BillSummaryHeader";
import BillExpandableSection from "./BillExpandableSection";
import BillFooter from "./BillFooter";

interface BillCardProps {
	bill: Bill;
	onChat: () => void;
	onView: () => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onChat, onView }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { billNo, products, purchaseDate, vendor, files } = bill;

	const { mutateAsync: deleteBill, isPending } = useBillDelete();

	const handleBillDelete = async () => {
		if (confirm("Delete this bill?")) {
			await deleteBill(billNo);
		}
	};

	const primaryProduct = products?.[0] ?? {
		productName: "Unnamed Product",
		warrantyEnd: null,
		s3Key: undefined,
	};

	return (
		<div className="w-full max-w-[340px] h-max bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
			<BillImageSection products={products} files={files} />

			<BillSummaryHeader
				primaryProduct={primaryProduct}
				isExpanded={isExpanded}
				onToggle={() => setIsExpanded((prev) => !prev)}
			/>

			<BillExpandableSection
				vendor={vendor}
				billNo={billNo}
				purchaseDate={purchaseDate}
				products={products}
				isExpanded={isExpanded}
			/>

			<BillFooter
				onChat={onChat}
				onView={onView}
				onDelete={handleBillDelete}
				isDeleting={isPending}
			/>
		</div>
	);
};

export default BillCard;
