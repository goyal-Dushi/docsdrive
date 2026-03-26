import { useState } from "react";
import { useLocation } from "wouter";
import { SpinnerIcon } from "@/assets";
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

	const isDisabled = isPending || isAnalysisPending;
	const hasProductImage = products.some((p) => p.imageFile);

	const canUpload = files.length > 0 && hasProductImage && !!billNo;

	return (
		<div className="h-[calc(100dvh-3.5rem)] bg-bg-page flex flex-col overflow-hidden">
			<main className="max-w-7xl mx-auto px-4 w-full flex flex-col h-full">
				<div
					className={`pt-6 pb-4 shrink-0 transition-opacity duration-300 ${
						isDisabled ? "opacity-50 pointer-events-none" : "opacity-100"
					}`}
				>
					<div className="max-w-md">
						<label
							htmlFor="billNo"
							className="block text-[16px] font-bold text-text-heading mb-1"
						>
							Bill Name
						</label>
						<p className="text-text-muted text-sm mb-2">
							This is for differentiating this particular bill from others
						</p>
						<input
							id="billNo"
							type="text"
							value={billNo}
							onChange={(e) => setBillNo(e.target.value)}
							disabled={isDisabled}
							placeholder="e.g. LG Washing Machine (Noida/Sameer)"
							className="w-full rounded-2xl border border-border bg-bg-card px-5 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
					<div className="flex flex-col lg:flex-row gap-10">
						<DocumentUpload
							isDisabled={isDisabled}
							files={files}
							setFiles={setFiles}
						/>
						<ProductUpload
							isDisabled={isDisabled}
							products={products}
							setProducts={setProducts}
						/>
					</div>
				</div>

				<div className="py-8 shrink-0 bg-bg-page border-t border-border">
					<div className="flex justify-center gap-5">
						<Button
							label="Cancel Upload"
							disabled={isDisabled}
							variant="secondary"
							onClick={() => navigate("/")}
						/>

						<Button
							label={isDisabled ? "Uploading document…" : "Finalize & Extract"}
							variant="primary"
							icon={isDisabled ? <SpinnerIcon /> : undefined}
							iconPosition="end"
							disabled={!canUpload || isDisabled}
							onClick={handleUpload}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
