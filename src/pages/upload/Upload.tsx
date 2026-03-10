import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/button";
import { http, uploadToS3 } from "@/hooks/useHttp";
import { DocumentUpload, ProductUpload, UploadProgress } from "./components";
import type { ProductEntry, UploadedFile, UploadResponse } from "./types";

export default function UploadPage() {
	const [, navigate] = useLocation();

	const [files, setFiles] = useState<UploadedFile[]>([]);
	const [products, setProducts] = useState<ProductEntry[]>([
		{ id: "p0", name: "" },
	]);

	const [progress, setProgress] = useState<string | null>(null);

	const mutation = useMutation({
		mutationFn: async () => {
			const res = await http
				.post<UploadResponse>("/upload/presigned", {
					files: files.map((f) => ({
						name: f.file.name,
						type: f.file.type,
						size: f.file.size,
					})),
					products: products.map((p) => p.name).filter(Boolean),
				})
				.then((r) => r.data);

			for (let i = 0; i < res.presignedUrls.length; i++) {
				const { url, fileName } = res.presignedUrls[i];

				setProgress(
					`Uploading ${i + 1}/${res.presignedUrls.length}: ${fileName}`,
				);

				const entry = files.find((f) => f.file.name === fileName);
				if (entry) await uploadToS3(url, entry.file);
			}

			setProgress(null);
		},
		onSuccess: () => navigate("/"),
	});

	const hasProductImage = products.some((p) => p.imageFile);

	const canUpload = files.length > 0 && hasProductImage && !mutation.isPending;

	return (
		<div className="min-h-screen bg-bg-page">
			<main className="max-w-7xl mx-auto px-4 py-12">
				<UploadProgress
					progress={progress}
					error={(mutation.error as any)?.message}
				/>

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
						label={
							mutation.isPending ? "Uploading document…" : "Finalize & Extract"
						}
						variant="primary"
						disabled={!canUpload}
						onClick={() => mutation.mutate()}
					/>
				</div>
			</main>
		</div>
	);
}
