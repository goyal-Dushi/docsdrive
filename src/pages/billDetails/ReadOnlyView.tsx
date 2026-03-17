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
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="mb-10">
				<h1 className="text-3xl font-extrabold text-text-heading mb-2">
					Bill Product Details
				</h1>
			</div>

			<div className="flex flex-col lg:flex-row gap-10">
				{/* Left: Products */}
				<ProductsView products={data.products} onEdit={handleOnEdit} />

				{/* Right: Bill Summary */}
				<BillSummaryView bill={data} onEdit={handleOnEdit} />
			</div>
		</main>
	);
};

export default ReadOnlyView;
