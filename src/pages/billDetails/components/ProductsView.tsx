import { ProductCard } from "@/components/productCard";
import type { BillDetail } from "@/types/bill";

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
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="var(--color-primary)"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
					<line x1="3" y1="9" x2="21" y2="9" />
					<line x1="9" y1="21" x2="9" y2="9" />
				</svg>
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
