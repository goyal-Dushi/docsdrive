import { useRef } from "react";
import { ImgIcon, PlusIcon, TrashIcon } from "@/assets";
import { Button, IconButton } from "@/components/button";
import type { ProductEntry } from "../types";

interface Props {
	products: ProductEntry[];
	isDisabled: boolean;
	setProducts: (p: ProductEntry[]) => void;
}

const ProductUpload: React.FC<Props> = (props) => {
	const { products, isDisabled, setProducts } = props;
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
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-border">
				<div className="flex flex-col gap-1">
					<h2 className="text-xl font-bold text-text-heading">
						Product Labels
					</h2>
					<p className="text-sm text-text-muted opacity-60">
						Products that above bill/documents cover
					</p>
				</div>

				<Button
					label="Add Entry"
					variant="primary"
					icon={<PlusIcon />}
					iconPosition="start"
					onClick={addProduct}
					disabled={isDisabled}
					className="w-full md:w-auto"
				/>
			</div>

			<div className="flex flex-col gap-6">
				{products.map((product) => (
					<div key={product.id} className="flex items-center gap-6">
						<button
							type="button"
							onClick={() =>
								!isDisabled && fileRefs.current[product.id]?.click()
							}
							disabled={isDisabled}
							className={`w-14 h-14 rounded-2xl border-2 border-dashed border-border bg-bg-page flex items-center justify-center shrink-0 transition-all ${
								isDisabled
									? "opacity-50 cursor-not-allowed bg-gray-100"
									: "hover:border-primary hover:bg-primary/5 cursor-pointer overflow-hidden"
							}`}
						>
							{product.image ? (
								<img
									src={product.image}
									alt="preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<ImgIcon />
							)}
						</button>

						<input
							type="file"
							accept="image/*"
							ref={(el) => {
								fileRefs.current[product.id] = el;
							}}
							className="hidden"
							disabled={isDisabled}
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
								disabled={isDisabled}
								placeholder="Enter product name"
								className={`w-full rounded-2xl border border-border bg-bg-page px-5 py-3 text-sm font-bold placeholder:italic placeholder:font-normal placeholder:opacity-50 ${
									isDisabled
										? "opacity-50 cursor-not-allowed bg-gray-100"
										: "focus:outline-none focus:ring-2 focus:ring-primary/20"
								}`}
							/>
						</div>

						<IconButton
							icon={<TrashIcon />}
							tooltip="Remove product"
							disabled={isDisabled}
							onClick={() => removeProduct(product.id)}
							className={`text-error! transition-all ${
								isDisabled ? "opacity-30 cursor-not-allowed" : ""
							}`}
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
