import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/button";
import { encodeBillName } from "@/utils";
import { DocumentUpload, ProductUpload } from "./components";
import useUpload from "./hooks/useUpload";
import type { ProductEntry, UploadedFile } from "./types";

export default function UploadPage() {
	const [, navigate] = useLocation();

	const [files, setFiles] = useState<UploadedFile[]>([]);
	const [products, setProducts] = useState<ProductEntry[]>([
		{ id: "p0", name: "" },
	]);
	const [billNo, setBillNo] = useState("");

	const {
		mutation: { mutate: upload, isPending },
		isAnalysisPending,
	} = useUpload();

	const handleUpload = () => {
		const modifiedBillName = encodeBillName(billNo);
		upload({
			files: files.map((f) => f.file),
			products,
			billNo: modifiedBillName,
		});
	};

	const hasProductImage = products.some((p) => p.imageFile);

	const canUpload = files.length > 0 && hasProductImage && !!billNo;

	return (
		<div className="min-h-screen bg-bg-page">
			<main className="max-w-7xl mx-auto px-4 py-12">
				<div className="mb-10 max-w-md">
					<label
						htmlFor="billNo"
						className="block text-sm font-bold text-text-heading mb-3"
					>
						Bill Number
					</label>
					<input
						id="billNo"
						type="text"
						value={billNo}
						onChange={(e) => setBillNo(e.target.value)}
						placeholder="e.g. SCLEN646"
						className="w-full rounded-2xl border border-border bg-bg-card px-5 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
				</div>

				<div className="flex flex-col lg:flex-row gap-10">
					<DocumentUpload files={files} setFiles={setFiles} />
					<ProductUpload products={products} setProducts={setProducts} />
				</div>

				<div className="flex justify-center gap-5 mt-16">
					<Button
						label="Cancel Upload"
						variant="secondary"
						onClick={() => navigate("/")}
					/>

					<Button
						label={isPending ? "Uploading document…" : "Finalize & Extract"}
						variant="primary"
						disabled={!canUpload || isPending || isAnalysisPending}
						onClick={handleUpload}
					/>
				</div>
			</main>
		</div>
	);
}
