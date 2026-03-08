import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "wouter";
import { EditBillDetails } from "@/components/billDetails";
import { Button } from "@/components/button";
import { ProductCard } from "@/components/productCard";
import { http } from "@/hooks/useHttp";
import type { BillDetail } from "@/types/bill";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_BILL: BillDetail = {
	id: "123",
	billNumber: "2023-10-25-A",
	vendor: "TechHaven Electronics",
	totalAmount: "$1,376.93",
	billDate: "Oct 25, 2023",
	pdfUrl: "#",
	pdfName: "original_bill_#2023-10-25-A.pdf",
	pdfSize: "2.4 MB",
	products: [
		{
			id: "p1",
			name: "Samsung 4K Smart TV",
			image: undefined,
			modelNumber: "UN55AU8000FXZA",
			serialNumber: "XJ924SBK482910L",
			productName: 'Samsung 55" Class AU8000 Crystal UHD 4K Smart TV (2021)',
			vendorName: "TechHaven Electronics",
			vendorAddress: "123 Commerce Blvd, Cityville, State, 54321",
			purchaseDate: "2023-10-25",
			basePrice: "499.99",
			gst: "30.00",
			paymentMode: "Credit Card (…1234)",
			warrantyStart: "2023-10-25",
			warrantyEnd: "2024-10-25",
			rawText:
				"Qty: 1. Subtotal: $499.99. Sales Tax: $30.00. Total: $529.99. Thank you for shopping with us! Return policy: 90 days with receipt.",
		},
		{
			id: "p2",
			name: "LG Front Load Washer",
			image: undefined,
			modelNumber: "WM4000HWA",
			serialNumber: "702KWRB00193",
			productName:
				"LG 4.5 cu. ft. HE Smart Front Load Washer with TurboWash 360",
			vendorName: "TechHaven Electronics",
			vendorAddress: "123 Commerce Blvd, Cityville, State, 54321",
			purchaseDate: "2023-10-25",
			basePrice: "799.00",
			gst: "47.94",
			paymentMode: "Credit Card (…1234)",
			warrantyStart: "2023-10-25",
			warrantyEnd: "2024-10-25",
			rawText:
				"Item: LG Washer WM4000HWA. Price: $799.00. Tax: $47.94. Total Line Item: $846.94. delivery scheduled for Oct 28, 2023. Installation included.",
		},
	],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillDetailsPage() {
	const params = useParams<{ id: string }>();
	const [isEditing, setIsEditing] = useState(false);
	const [billData, setBillData] = useState<BillDetail | null>(null);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["bill", params.id],
		queryFn: () =>
			http.get<BillDetail>(`/bills/${params.id}`).then((r) => r.data),
		placeholderData: DUMMY_BILL,
	});

	const bill = billData ?? data ?? DUMMY_BILL;

	if (isEditing) {
		return (
			<div className="min-h-screen bg-[var(--color-bg-page)]">
				<EditBillDetails
					bill={bill}
					onCancel={() => setIsEditing(false)}
					onSave={(updated) => {
						setBillData(updated);
						setIsEditing(false);
					}}
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[var(--color-bg-page)]">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				{isLoading && (
					<div className="flex items-center justify-center h-64 mb-10 bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] shadow-sm">
						<div className="flex flex-col items-center gap-4">
							<div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
							<p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
								Loading Details...
							</p>
						</div>
					</div>
				)}

				{isError && (
					<div className="p-6 rounded-2xl bg-[var(--color-error-bg)] border border-[var(--color-error)] text-[var(--color-error)] text-sm mb-10 flex items-center gap-3 shadow-sm font-semibold">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						{(error as { message?: string })?.message ??
							"Failed to load bill details. Please check your connection."}
					</div>
				)}

				<div className="mb-10">
					<h1 className="text-3xl font-extrabold text-[var(--color-text-heading)] mb-2">
						Bill Product Details
					</h1>
					<p className="text-base text-[var(--color-text-muted)] leading-relaxed">
						Review and manage products extracted from{" "}
						<span className="text-[var(--color-text-body)] font-semibold">
							Bill #{bill.billNumber}
						</span>{" "}
						for{" "}
						<span className="text-[var(--color-text-body)] font-semibold">
							'{bill.vendor}'
						</span>
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-10">
					{/* Left: Products */}
					<div className="flex-1 flex flex-col gap-8">
						<div className="flex items-center gap-3 py-2 border-b border-[var(--color-border)]">
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
							<h2 className="text-xl font-bold text-[var(--color-text-heading)]">
								Extracted Products
							</h2>
						</div>
						<div className="flex flex-col gap-8">
							{bill.products.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									onEdit={() => setIsEditing(true)}
								/>
							))}
						</div>
					</div>

					{/* Right: Bill Summary */}
					<div className="lg:w-80 xl:w-96 shrink-0">
						<div className="sticky top-24 flex flex-col gap-8">
							{/* Summary card */}
							<div className="bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border)] p-8 shadow-md">
								<div className="flex items-center gap-3 mb-8 pb-4 border-b border-[var(--color-border)]">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="var(--color-primary)"
										strokeWidth="2.5"
									>
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
										<polyline points="14 2 14 8 20 8" />
									</svg>
									<h3 className="text-xl font-bold text-[var(--color-text-heading)]">
										Bill Summary
									</h3>
								</div>

								<div className="space-y-6">
									<div>
										<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
											Total Amount
										</p>
										<p className="text-2xl font-black text-[var(--color-text-heading)] leading-none">
											{bill.totalAmount}
										</p>
									</div>
									<div>
										<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
											Bill Date
										</p>
										<p className="text-sm font-bold text-[var(--color-text-body)]">
											{bill.billDate}
										</p>
									</div>
									<div>
										<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
											Vendor
										</p>
										<p className="text-sm font-bold text-[var(--color-text-body)] leading-snug">
											{bill.vendor}
										</p>
									</div>

									<div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border)] shadow-inner">
										<div className="w-12 h-14 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#D97706"
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
												<polyline points="14 2 14 8 20 8" />
											</svg>
										</div>
										<div className="min-w-0">
											<p className="text-xs font-bold text-[var(--color-text-body)] truncate">
												{bill.pdfName}
											</p>
											<p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">
												{bill.pdfSize} • PDF DOCUMENT
											</p>
										</div>
									</div>
								</div>

								<div className="mt-10 flex flex-col gap-3 pt-8 border-t border-[var(--color-border)]">
									<Button
										label="View Original PDF"
										variant="secondary"
										fullWidth
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
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
												<circle cx="12" cy="12" r="3" />
											</svg>
										}
										iconPosition="start"
										className="py-3"
									/>
									<Button
										label="Edit Bill Data"
										variant="primary"
										fullWidth
										onClick={() => setIsEditing(true)}
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
												<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
												<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
											</svg>
										}
										iconPosition="start"
										className="py-3 shadow-lg shadow-blue-500/20"
									/>
								</div>
							</div>

							{/* AI Verification Banner */}
							<div className="bg-[var(--color-info-bg)] rounded-2xl border border-[var(--color-info)] p-6">
								<div className="flex gap-3">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="var(--color-info)"
										strokeWidth="2.5"
										className="shrink-0"
									>
										<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
										<path d="M9 12l2 2 4-4" />
									</svg>
									<div>
										<p className="text-sm font-bold text-[var(--color-info)] mb-1 uppercase tracking-tight">
											AI Verified
										</p>
										<p className="text-xs text-[var(--color-text-body)] font-medium leading-relaxed">
											Extracted data has been verified against the original
											document for accuracy.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
