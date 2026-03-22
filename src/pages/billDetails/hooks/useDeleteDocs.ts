import { useMutation } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { useToast } from "@/hooks/useToast";

interface UseDeleteDocProps {
	files: string[];
	billNo: string;
}

const useDeleteDocs = () => {
	const http = useHttp();
	const { showToast } = useToast();

	const handleSuccess = () => {
		showToast("success", "File data deleted successfully");
	};

	const handleError = (err: unknown) => {
		console.error("Error while deleting file data: ", err);
		showToast("error", "Deletion failed. Please try again later!");
	};

	return useMutation({
		mutationFn: async ({ files, billNo }: UseDeleteDocProps) => {
			const response = await http
				.delete("/deleteDocs", {
					data: {
						docNames: files.map((file) => file.split("/").pop()),
						billNo,
					},
				})
				.then((r) => r.data);

			return response;
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});
};

export default useDeleteDocs;
