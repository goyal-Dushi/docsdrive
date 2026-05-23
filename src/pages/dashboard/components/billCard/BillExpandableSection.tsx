import type { FC } from "react";
import { formatDate } from "@/utils";
import type { BillProduct } from "./types";

interface BillExpandableSectionProps {
	vendor: string;
	billNo: string;
	purchaseDate?: string | null;
	products?: BillProduct[];
	isExpanded: boolean;
}

const BillExpandableSection: FC<BillExpandableSectionProps> = ({
	vendor,
	billNo,
	purchaseDate,
	products = [],
	isExpanded,
}) => (
	<div
		className={`overflow-hidden transition-all duration-300 ${
			isExpanded ? "max-h-[500px]" : "max-h-0"
		}`}
	>
		<div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
			<div className="grid grid-cols-2 gap-y-4 gap-x-3 text-xs">
				<div>
					<p className="text-gray-400 uppercase text-[10px] font-bold mb-1">
						Vendor
					</p>
					<p className="font-medium text-gray-900 text-wrap">{vendor}</p>
				</div>

				<div>
					<p className="text-gray-400 uppercase text-[10px] font-bold mb-1">
						Bill No
					</p>
					<p className="font-medium text-gray-900 text-wrap truncate">#{billNo}</p>
				</div>

				<div>
					<p className="text-gray-400 uppercase text-[10px] font-bold mb-1">
						Purchased
					</p>
					<p className="font-medium text-gray-900">
						{purchaseDate ? formatDate(purchaseDate) : "Unknown"}
					</p>
				</div>
			</div>

			<div className="mt-5 pt-4 border-t border-gray-200">
				<p className="text-gray-400 uppercase text-[10px] font-bold mb-3">
					All Items
				</p>

				<div className="flex flex-col gap-2">
					{products.length === 0 ? (
						<p className="text-gray-500 text-sm">No products found.</p>
					) : (
						products.map((product, idx) => (
							<div key={idx} className="flex justify-between items-start gap-3 text-xs">
								<p className="text-gray-900 font-medium flex-1 break-words">
									{product.productName || "Unnamed product"}
								</p>
								<p className="text-gray-500 whitespace-nowrap">
									{product.warrantyEnd ? formatDate(product.warrantyEnd) : "No Warranty"}
								</p>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	</div>
);

export default BillExpandableSection;
