import type { BillDetail } from "@/types/bill";
import ProductCard from "./ProductCard";

interface ProductsViewProps {
	products: BillDetail["products"];
	onEdit?: () => void;
}

const ProductsView: React.FC<ProductsViewProps> = (props) => {
	const { products, onEdit } = props;

	const handleOnEdit = () => {
		onEdit?.();
	};

	return (
		<div className="flex-1 flex flex-col gap-8">
			<div className="flex items-center gap-3 py-2 border-b border-border">
				<h2 className="text-xl font-bold text-text-heading">
					Extracted Products
				</h2>
			</div>
			<div className="flex flex-col gap-8">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onEdit={handleOnEdit}
					/>
				))}
			</div>
		</div>
	);
};

export default ProductsView;
