import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ExclamationIcon, GoBackIcon } from "@/assets";
import { useHttp } from "@/hooks/useHttp";
import type { BillDetail } from "@/types/bill";
import DetailsView from "./DetailsView";

export default function BillDetailsPage() {
	const params = useParams<{ id: string }>();
	const http = useHttp();
	const [billData, setBillData] = useState<BillDetail | null>(null);

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["bill", params.id],
		queryFn: async () =>
			await http
				.get<BillDetail>(`/getBillData/${params.id}`)
				.then((r) => r.data),
	});

	const onEditDone = () => {
		refetch();
	};

	useEffect(() => {
		setBillData(data ?? null);
	}, [data]);

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-4">
				<Link href="/dashboard">
					<GoBackIcon />
				</Link>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center h-64 mb-10 bg-bg-card rounded-3xl border border-border shadow-sm">
					<div className="flex flex-col items-center gap-4">
						<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
						<p className="text-sm font-bold text-text-muted uppercase tracking-widest">
							Loading Details...
						</p>
					</div>
				</div>
			) : null}

			{isError ? (
				<div className="p-6 rounded-2xl bg-error-bg border border-error text-error text-sm mb-10 flex items-center gap-3 shadow-sm font-semibold">
					<ExclamationIcon />
					{(error as { message?: string })?.message ??
						"Failed to load bill details. Please check your connection."}
				</div>
			) : null}

			{billData ? (
				<DetailsView onEditDone={onEditDone} data={billData} />
			) : (
				<div>No data to display</div>
			)}
		</main>
	);
}
