import { useMutation } from "@tanstack/react-query";
import { useHttp } from "@/hooks/useHttp";
import { useToast } from "@/hooks/useToast";

export interface UpdateProductT {
	SK: string;
	[key: string]: string;
}

interface UseUpdProdInfoProps {
	products: UpdateProductT[];
	billNo: string;
}

const useUpdProdInfo = () => {
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
		mutationFn: async ({ products, billNo }: UseUpdProdInfoProps) => {
			const response = await http
				.post("/updateProductInfo", {
					products,
					billNo,
				})
				.then((r) => r.data);

			return response;
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});
};

export default useUpdProdInfo;
