import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ExclamationIcon, PlusIcon } from "@/assets";
import { Button } from "@/components/button";
import http from "@/hooks/useHttp";
import {
	type Bill,
	BillCard,
	BillCardSkeleton,
	PendingBillAnalysisBtn,
} from "./components";

interface BillResponse {
	data: Bill[];
}

export default function DashboardPage() {
	const [, navigate] = useLocation();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["dashboard-data"],
		queryFn: async () => {
			const response =
				await http.get<BillResponse["data"]>("/getDashboardData");
			console.log("dashboard response", response.data);
			return response.data;
		},
		retry: 2,
	});

	const bills = data ?? [];

	if (isError) {
		return (
			<div className="mb-10 p-6 rounded-2xl bg-error-bg border border-error text-error text-sm font-bold flex items-center gap-3 shadow-sm">
				<ExclamationIcon className="w-8 h-8" />
				{(error as { message?: string })?.message ??
					"Failed to load your bills. Please refresh to try again."}
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 2 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton has no stable id
					<BillCardSkeleton key={`card-${i}`} />
				))}
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-bg-page">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
					<div>
						<h1 className="text-3xl sm:text-4xl font-black text-text-heading tracking-tight">
							Analyzed Bills Gallery
						</h1>
						<p className="text-base sm:text-lg text-text-muted mt-2 font-medium max-w-2xl">
							Review your extracted appliance data, manuals, and active
							warranties in one place.
						</p>
					</div>
					<Button
						label="Upload New Bill"
						variant="primary"
						icon={<PlusIcon className="w-4 h-4" />}
						iconPosition="start"
						onClick={() => navigate("/upload")}
						className="py-4 px-6 text-blue-500 shadow-xl shadow-blue-500/20"
					/>
				</div>
				<PendingBillAnalysisBtn />

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{bills.map((bill) => (
						<BillCard
							key={bill.billNo}
							bill={bill}
							onChat={() => navigate(`/chat/${bill.billNo}`)}
							onView={() => navigate(`/bills/${bill.billNo}`)}
						/>
					))}
				</div>
			</main>
		</div>
	);
}
