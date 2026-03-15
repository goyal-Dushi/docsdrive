import { useMutation } from "@tanstack/react-query";
import { navigate } from "wouter/use-browser-location";
import { useHttp } from "@/hooks/useHttp";
import { useToast } from "@/hooks/useToast";
import { clearPendingBills, deletePendingBills } from "@/utils";

interface UserPerformAiAnalysis {
	billNo: string[];
}

const usePerformAiAnalysis = () => {
	const http = useHttp();
	const { showToast } = useToast();

	const handleSuccess = () => {
		clearPendingBills();
		showToast("success", "AI analysis of bills done successfully!");
		navigate("/dashboard");
	};

	const handleError = (err: unknown) => {
		console.error("Error while performing AI analysis: ", err);
		showToast("error", "Some error occurred when performing AI analysis.");
	};

	return useMutation({
		mutationFn: async ({ billNo }: UserPerformAiAnalysis) => {
			const results = await Promise.allSettled(
				billNo.map(async (no) => {
					await http.post("/aiInfoAnalysis", { billNo: no });
					deletePendingBills(no);
				}),
			);

			const failed = results.filter((r) => r.status === "rejected");
			if (failed.length > 0) {
				throw new Error(`Failed to analyze ${failed.length} bills.`);
			}
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});
};

export default usePerformAiAnalysis;
