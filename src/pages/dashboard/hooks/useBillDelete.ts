import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { useToast } from "@/hooks/useToast";

const useBillDelete = () => {
	const http = useHttp();
	const { showToast } = useToast();
	const queryClient = useQueryClient();

	const handleSuccess = () => {
		showToast("success", "Bill deleted successfully");
		queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
	};

	const handleError = (error: Error) => {
		console.error("Error deleting bill:", error);
		showToast("error", "Error while deleting bill. Please try again later!");
	};

	return useMutation({
		mutationFn: async (billNo: string) => {
			const response = await http.delete(`/deleteBill/${billNo}`);
			return response;
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});
};

export default useBillDelete;
