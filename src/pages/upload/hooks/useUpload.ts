import { useMutation } from "@tanstack/react-query";
import { uploadToS3, useHttp } from "@/hooks/useHttp";
import { useToast } from "@/hooks/useToast";
import { updatePendingBills } from "@/utils";
import type { ProductEntry, UploadResponse } from "../types";
import usePerformAiAnalysis from "./usePerformAiAnalysis";

interface UseUploadProps {
	files: File[];
	products?: ProductEntry[];
	billNo: string;
	isEdit?: boolean;
}

const useUpload = () => {
	const http = useHttp();
	const { showToast } = useToast();
	const { mutate: performAIanalysis, isPending: isAnalysisPending } =
		usePerformAiAnalysis();

	const handlePerformAiAnalysis = async (vars: UseUploadProps) => {
		const { billNo } = vars;
		performAIanalysis({ billNo: [billNo] });
	};

	const handleSuccess = (_: unknown, variables: UseUploadProps) => {
		const { isEdit } = variables;
		showToast(
			"success",
			"Data added successfully to our server. Performing AI Analysis",
		);
		if (!isEdit) {
			handlePerformAiAnalysis(variables);
		}
	};

	const handleError = (err: unknown) => {
		console.error("Error while uploading to s3: ", err);
		showToast("error", "Upload failed. Please try again later!");
	};

	const mutation = useMutation({
		mutationFn: async ({ files, products, billNo }: UseUploadProps) => {
			updatePendingBills(billNo);
			showToast(
				"warning",
				"Please don't reload the page while the Upload and analysis is in progress!",
			);
			const { urls } = await http
				.post<UploadResponse>("/getUploadUrls", {
					files: files.map((f) => ({
						name: f.name,
						type: f.type,
					})),
					products: products
						?.filter((p) => p.name && p.imageFile)
						.map((p) => ({
							name: p.name,
							type: p.imageFile?.type || "image/webp",
						})),
					billNo,
				})
				.then((r: { data: UploadResponse }) => r.data);

			await Promise.all(
				urls.map(async (uploadPromise) => {
					const { uploadUrl, kind } = uploadPromise;

					if (kind === "file") {
						const entry = files.find((f) => f.name === uploadPromise.fileName);
						if (entry) await uploadToS3(uploadUrl, entry);
					}

					if (kind === "product") {
						const entry = products?.find(
							(p) => p.name === uploadPromise.productName,
						);
						if (entry?.imageFile) await uploadToS3(uploadUrl, entry.imageFile);
					}
				}),
			);
		},
		onSuccess: handleSuccess,
		onError: handleError,
	});

	return { mutation, isAnalysisPending };
};

export default useUpload;
