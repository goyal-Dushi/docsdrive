import { useToast } from "@/hooks/useToast";
import useUpload from "@/pages/upload/hooks/useUpload";
import useDeleteDocs from "./useDeleteDocs";
import usePerfFileAnalysis, { type UploadFileT } from "./usePerfFileAnalysis";
import useUpdProdInfo from "./useUpdProdInfo";

type UpdProductT = {
	SK: string;
	[key: string]: string;
};

export interface UpdFileI {
	details: File;
	products: UpdProductT[];
}

export interface UpdateBillI {
	billNo: string;
	products?: UpdProductT[];
	addedFiles?: UpdFileI[];
	deletedFiles?: string[];
}

const useUpdateBill = () => {
	const { showToast } = useToast();
	const { mutation: useUploadMutation } = useUpload();
	const { mutateAsync: uplaodFiles, isPending: isUploadingFiles } =
		useUploadMutation;
	const { mutateAsync: performFileAnalysis, isPending: isPerformingAnalysis } =
		usePerfFileAnalysis();
	const { mutateAsync: deleteDocs, isPending: isDeletingDocs } =
		useDeleteDocs();
	const { mutateAsync: updateProducts, isPending: isUpdProductPending } =
		useUpdProdInfo();

	const updateBill = async (data: UpdateBillI) => {
		const { billNo, products, addedFiles, deletedFiles } = data;
		console.log("data: ", data);

		// adding new files and data
		if (addedFiles?.length) {
			try {
				await uplaodFiles({
					files: addedFiles.map((f) => f.details),
					billNo,
					isEdit: true,
				});
			} catch (err) {
				console.error("Error while uploading files: ", err);
				// showToast("error", "Failed to upload files. Please try again later!");
			}

			try {
				const performFileUpdPayload: UploadFileT[] = addedFiles.map((f) => {
					return {
						name: f.details.name,
						products: f.products.map((p) => {
							return {
								name: p.name,
								SK: p.SK,
							};
						}),
					} as UploadFileT;
				});

				await performFileAnalysis({
					billNo,
					files: performFileUpdPayload,
				});
			} catch (err) {
				console.error(
					"Error in upd bill while performing file analysis: ",
					err,
				);
				// showToast(
				// 	"error",
				// 	"Failed to perform file analysis. Please try again later!",
				// );
			}
		}

		// deleting existing file info
		if (deletedFiles?.length) {
			try {
				await deleteDocs({
					billNo,
					files: deletedFiles,
				});
			} catch (err) {
				console.error("Error in upd bill while deleting files: ", err);
				// showToast(
				// 	"error",
				// 	"Error while removing files and associated data from server. Please try again later!",
				// );
			}
		}

		// updating product(s) information
		if (products?.length) {
			try {
				await updateProducts({
					billNo,
					products,
				});
			} catch (err) {
				console.error("Error in upd bill while updating products: ", err);
				showToast(
					"error",
					"We were not able to update product information. Please try again later!",
				);
			}
		}
	};

	const isPending =
		isUploadingFiles ||
		isPerformingAnalysis ||
		isDeletingDocs ||
		isUpdProductPending;

	return { updateBill, isPending };
};

export default useUpdateBill;
