import { ExclamationIcon } from "@/assets";
import { formatDate } from "@/utils";
import type { BillProduct } from "./types";

type ProductRowProps = {
	product: BillProduct;
};

const checkWarranty = (warrantyEnd: string | null | undefined): boolean => {
	if (!warrantyEnd?.trim()) {
		return false;
	}
	return new Date(warrantyEnd) > new Date();
};

const ProductRow: React.FC<ProductRowProps> = (props) => {
	const { product } = props;
	const { productName, warrantyEnd } = product;

	const hasWarranty = checkWarranty(warrantyEnd);

	return (
		<div
			key={`${productName}`}
			className="group/product flex items-center justify-between gap-4 p-3 rounded-xl bg-bg-page/50 border border-border hover:border-primary/20 transition-all duration-300"
		>
			<span className="text-sm font-bold text-text-heading">{productName}</span>
			{hasWarranty ? (
				<div className="shrink-0 flex flex-col items-end gap-0.5">
					<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-success-bg text-success text-[8px] font-black uppercase tracking-widest border border-success/20">
						Warranty Active
					</span>
					<span className="text-[10px] text-text-muted font-bold">
						Ends {formatDate(warrantyEnd)}
					</span>
				</div>
			) : (
				<span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-error-bg text-error text-[8px] font-black uppercase tracking-widest border border-error/20">
					<ExclamationIcon className="w-2.5 h-2.5" />
					No Warranty
				</span>
			)}
		</div>
	);
};

export default ProductRow;
