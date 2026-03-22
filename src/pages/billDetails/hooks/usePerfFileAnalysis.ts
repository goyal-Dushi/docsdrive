import { useMutation } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { useToast } from "@/hooks/useToast";

export type UploadFileT = {
	name: string;
	products: {
		name: string;
		SK: string;
	}[];
};

interface UsePerfFileAnalysisMutationProps {
	files: UploadFileT[];
	billNo: string;
}

const usePerfFileAnalysis = () => {
	const http = useHttp();
	const { showToast } = useToast();

	const handleSuccess = () => {
		showToast("success", "File data updated successfully");
	};

	const handleError = (err: unknown) => {
		console.error("Error while updating file data: ", err);
		showToast("error", "Updation failed. Please try again later!");
	};

	return useMutation({
		mutationFn: async ({ files, billNo }: UsePerfFileAnalysisMutationProps) => {
			const response = await http
				.post("/performFileInfoAnalysis", {
					files,
					billNo,
				})
				.then((r) => r.data);

			return response;
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});
};

export default usePerfFileAnalysis;
