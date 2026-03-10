import { useRef } from "react";
import { PlusIcon, TrashIcon } from "@/assets";
import { Button, IconButton } from "@/components/button";
import type { ProductEntry } from "../types";

interface Props {
	products: ProductEntry[];
	setProducts: (p: ProductEntry[]) => void;
}

const ProductUpload: React.FC<Props> = (props) => {
	const { products, setProducts } = props;
	const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

	const addProduct = () => {
		setProducts([...products, { id: `p${Date.now()}`, name: "" }]);
	};

	const removeProduct = (id: string) => {
		setProducts(products.filter((p) => p.id !== id));
	};

	const updateProductName = (id: string, name: string) => {
		setProducts(products.map((p) => (p.id === id ? { ...p, name } : p)));
	};

	const updateImage = (id: string, file: File) => {
		const preview = URL.createObjectURL(file);

		setProducts(
			products.map((p) =>
				p.id === id ? { ...p, image: preview, imageFile: file } : p,
			),
		);
	};

	return (
		<div className="flex-1 bg-bg-card rounded-3xl border border-border p-8 shadow-md">
			<div className="flex justify-between mb-10 pb-6 border-b border-border">
				<h2 className="text-xl font-bold text-text-heading">Product Labels</h2>

				<Button
					label="Add Entry"
					variant="primary"
					icon={<PlusIcon />}
					iconPosition="start"
					onClick={addProduct}
				/>
			</div>

			<div className="flex flex-col gap-6">
				{products.map((product) => (
					<div key={product.id} className="flex items-center gap-6">
						{/* IMAGE BUTTON */}
						<button
							type="button"
							onClick={() => fileRefs.current[product.id]?.click()}
							className="w-14 h-14 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-page)] flex items-center justify-center shrink-0 cursor-pointer overflow-hidden"
						>
							{product.image ? (
								<img
									src={product.image}
									alt="preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									stroke="var(--color-text-muted)"
									strokeWidth="1.5"
									fill="none"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<polyline points="21 15 16 10 5 21" />
								</svg>
							)}
						</button>

						{/* Hidden file input */}
						<input
							type="file"
							accept="image/*"
							ref={(el) => {
								fileRefs.current[product.id] = el;
							}}
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) updateImage(product.id, file);
							}}
						/>

						{/* Product name */}
						<div className="flex-1">
							<input
								value={product.name}
								onChange={(e) => updateProductName(product.id, e.target.value)}
								placeholder="Enter product name"
								className="w-full rounded-2xl border border-border bg-bg-page px-5 py-3 text-sm font-bold"
							/>
						</div>

						<IconButton
							icon={<TrashIcon />}
							tooltip="Remove product"
							onClick={() => removeProduct(product.id)}
							className="text-error!"
						/>
					</div>
				))}
			</div>

			{products.length === 0 && (
				<div className="text-center py-10">
					<p className="text-sm text-text-muted font-bold italic opacity-60">
						Add tags for each item found in your documents.
					</p>
				</div>
			)}
		</div>
	);
};

export default ProductUpload;
