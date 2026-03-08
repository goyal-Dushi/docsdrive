import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button, IconButton } from "@/components/button";
import DisplayFileIcon from "@/components/DisplayFileIcon";
import { http, uploadToS3 } from "@/hooks/useHttp";
import { formatBytes } from "@/utils";

interface PresignedUrlItem {
	url: string;
	fileKey: string;
	fileName: string;
}

interface UploadResponse {
	presignedUrls: PresignedUrlItem[];
}

interface UploadedFile {
	id: string;
	file: File;
}

interface ProductEntry {
	id: string;
	name: string;
	image?: string;
}

export default function UploadPage() {
	const [, navigate] = useLocation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [products, setProducts] = useState<ProductEntry[]>([
		{ id: "p0", name: "" },
	]);
	const [uploadProgress, setUploadProgress] = useState<string | null>(null);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFiles = Array.from(e.target.files).map((f) => ({
			id: `${Date.now()}-${f.name}`,
			file: f,
		}));
		setUploadedFiles((prev) => [...prev, ...newFiles]);
		e.target.value = "";
	};

	const removeFile = (id: string) => {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
	};

	const addProduct = () => {
		setProducts((prev) => [...prev, { id: `p${Date.now()}`, name: "" }]);
	};

	const removeProduct = (id: string) => {
		setProducts((prev) => prev.filter((p) => p.id !== id));
	};

	const updateProduct = (id: string, name: string) => {
		setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
	};

	const mutation = useMutation({
		mutationFn: async () => {
			const res = await http
				.post<UploadResponse>("/upload/presigned", {
					files: uploadedFiles.map((f) => ({
						name: f.file.name,
						type: f.file.type,
						size: f.file.size,
					})),
					products: products.map((p) => p.name).filter(Boolean),
				})
				.then((r) => r.data);

			const totalFiles = res.presignedUrls.length;
			for (let i = 0; i < totalFiles; i++) {
				const { url, fileName } = res.presignedUrls[i];
				setUploadProgress(`Uploading ${i + 1}/${totalFiles}: ${fileName}`);
				const fileEntry = uploadedFiles.find((f) => f.file.name === fileName);
				if (fileEntry) await uploadToS3(url, fileEntry.file);
			}
			setUploadProgress(null);
		},
		onSuccess: () => navigate("/"),
	});

	const canUpload = uploadedFiles.length > 0 && !mutation.isPending;

	return (
		<div className="min-h-screen bg-bg-page">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="mb-12">
					<h1 className="text-3xl sm:text-4xl font-black text-text-heading mb-2 tracking-tight">
						Upload to Digital Binder
					</h1>
					<p className="text-base sm:text-lg text-text-muted font-medium max-w-2xl leading-relaxed">
						Add your appliance documents and product details. We'll extract the
						data and organize it for you automatically.
					</p>
				</div>

				{mutation.isError && (
					<div className="mb-8 p-6 rounded-2xl bg-error-bg border border-[var(--color-error)] text-[var(--color-error)] text-sm font-bold flex items-center gap-3 shadow-sm">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						{(mutation.error as { message?: string })?.message ??
							"Upload failed. Please try again or check your connection."}
					</div>
				)}

				{uploadProgress && (
					<div className="mb-8 p-6 rounded-2xl bg-[var(--color-info-bg)] border border-[var(--color-info)] text-[var(--color-info)] text-sm font-bold flex items-center gap-4 shadow-sm">
						<div className="w-5 h-5 border-3 border-[var(--color-info)] border-t-transparent rounded-full animate-spin shrink-0" />
						{uploadProgress}
					</div>
				)}

				<div className="flex flex-col lg:flex-row gap-10">
					{/* Left: Document Uploads */}
					<div className="flex-1 bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] p-8 shadow-md">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-[var(--color-border)]">
							<div className="flex items-center gap-3">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="var(--color-primary)"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14 2 14 8 20 8" />
								</svg>
								<h2 className="text-xl font-bold text-[var(--color-text-heading)]">
									Document Uploads
								</h2>
							</div>
							<Button
								label="Browse Local Files"
								variant="primary"
								icon={
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line x1="12" y1="3" x2="12" y2="15" />
									</svg>
								}
								iconPosition="start"
								onClick={() => fileInputRef.current?.click()}
								className="py-3 px-6 shadow-lg shadow-blue-500/10"
							/>
						</div>

						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
							onChange={handleFileInput}
							className="hidden"
						/>

						{uploadedFiles.length === 0 ? (
							<div className="flex flex-col items-center gap-4 py-20 text-center bg-[var(--color-bg-page)] rounded-2xl border-2 border-dashed border-[var(--color-border)] opacity-70">
								<svg
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="var(--color-text-muted)"
									strokeWidth="1"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14 2 14 8 20 8" />
									<circle cx="12" cy="14" r="3" />
									<path d="M12 11v6" />
									<path d="M9 14h6" />
								</svg>
								<div className="max-w-xs px-4">
									<p className="text-base font-bold text-text-heading mb-1">
										No files selected yet
									</p>
									<p className="text-sm text-text-muted font-medium">
										Upload PDFs, images, or Word documents. We'll scan them for
										appliance info.
									</p>
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								<p className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">
									Selected Files ({uploadedFiles.length})
								</p>
								{uploadedFiles.map(({ id, file }) => (
									<div
										key={id}
										className="flex items-center gap-5 p-5 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)] transition-colors group"
									>
										<DisplayFileIcon name={file.name} />
										<div className="flex-1 min-w-0">
											<p className="text-sm text-text-body font-bold truncate group-hover:text-text-heading transition-colors">
												{file.name}
											</p>
											<p className="text-xs text-text-muted font-bold uppercase tracking-wide mt-0.5">
												{formatBytes(file.size)}
											</p>
										</div>
										<IconButton
											icon={
												<svg
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="3 6 5 6 21 6" />
													<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
													<path d="M9 6V4h6v2" />
												</svg>
											}
											tooltip="Remove file"
											onClick={() => removeFile(id)}
											className="text-error!"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="flex-1 bg-bg-card rounded-3xl border border-border p-8 shadow-md">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-[var(--color-border)]">
							<div className="flex items-center gap-3">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="primary"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
									<line x1="3" y1="9" x2="21" y2="9" />
									<line x1="9" y1="21" x2="9" y2="9" />
								</svg>
								<h2 className="text-xl font-bold text-text-heading">
									Product Labels
								</h2>
							</div>
							<Button
								label="Add Entry"
								variant="primary"
								icon={
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="12" y1="5" x2="12" y2="19" />
										<line x1="5" y1="12" x2="19" y2="12" />
									</svg>
								}
								iconPosition="start"
								onClick={addProduct}
								className="py-3 px-6 shadow-lg shadow-blue-500/10"
							/>
						</div>

						<div className="flex flex-col gap-6">
							{products.map((product) => (
								<div key={product.id} className="flex items-center gap-6 p-1">
									<div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-page)] flex items-center justify-center shrink-0 shadow-inner">
										{product.image ? (
											<img
												src={product.image}
												alt=""
												className="w-14 h-14 rounded-2xl object-cover"
											/>
										) : (
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="var(--color-text-muted)"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="opacity-40"
											>
												<rect
													x="3"
													y="3"
													width="18"
													height="18"
													rx="2"
													ry="2"
												/>
												<circle cx="8.5" cy="8.5" r="1.5" />
												<polyline points="21 15 16 10 5 21" />
											</svg>
										)}
									</div>
									<div className="flex-1 flex flex-col gap-1.5">
										<label
											htmlFor={`productName-${product.id}`}
											className="text-[10px] font-black uppercase tracking-widest text-text-muted"
										>
											Product Name
										</label>
										<input
											id={`productName-${product.id}`}
											type="text"
											name="productName"
											value={product.name}
											onChange={(e) =>
												updateProduct(product.id, e.target.value)
											}
											placeholder={
												products.indexOf(product) === 0
													? "e.g. Samsung Dishwasher"
													: "Enter product name"
											}
											className="w-full rounded-2xl border border-border bg-bg-page px-5 py-3 text-sm font-bold text-text-body placeholder-text-muted focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
										/>
									</div>
									<IconButton
										icon={
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="3 6 5 6 21 6" />
												<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
											</svg>
										}
										tooltip="Remove product"
										onClick={() => removeProduct(product.id)}
										className="mt-5 text-error!"
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
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-16 pt-10 border-t border-border">
					<Button
						label="Cancel Upload"
						variant="secondary"
						className="w-full sm:w-auto sm:min-w-[180px] py-4"
						onClick={() => navigate("/")}
					/>
					<Button
						label={
							mutation.isPending ? "Uploading document…" : "Finalize & Extract"
						}
						variant="primary"
						className="w-full sm:w-auto sm:min-w-[240px] py-4 shadow-xl shadow-blue-500/20"
						disabled={!canUpload}
						onClick={() => mutation.mutate()}
						icon={
							!mutation.isPending && (
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							)
						}
						iconPosition="end"
					/>
				</div>
			</main>
		</div>
	);
}
