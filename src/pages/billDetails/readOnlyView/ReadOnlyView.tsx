import type { BillDetail } from "@/types/bill";
import { BillSummaryView, ProductsView } from "./components";

interface ReadOnlyViewProps {
	data: BillDetail;
	onEdit?: () => void;
}

const ReadOnlyView: React.FC<ReadOnlyViewProps> = (props) => {
	const { data, onEdit } = props;

	const handleOnEdit = () => {
		onEdit?.();
	};

	return (
		<>
			<div className="mb-2">
				<h1 className="text-3xl font-extrabold text-text-heading">
					Bill Product Details
				</h1>
			</div>

			<div className="flex flex-col lg:flex-row gap-10">
				{/* Left: Products */}
				<ProductsView products={data.products} onEdit={handleOnEdit} />

				{/* Right: Bill Summary */}
				<BillSummaryView bill={data} onEdit={handleOnEdit} />
			</div>
		</>
	);
};

export default ReadOnlyView;
