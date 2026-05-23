import { useMemo, useState } from "react";
import {
	EditIcon,
} from "@/assets";
import LeftView from "./components/leftView/LeftView";
import RightView from "./components/rightView/RightView";
import type { BillDetail, Product } from "@/types/bill";
import { type UpdFileI, useUpdateBill } from "../hooks";
import { getBillDate, getTotalAmount, getVendor } from "../utils";

interface EditViewProps {
	bill: BillDetail;
	onCancel: () => void;
	onSave: () => void;
}

const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

const EditView: React.FC<EditViewProps> = (props) => {
	const { bill, onCancel, onSave } = props;
	const [formData, setFormData] = useState<BillDetail>(bill);
	const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>(
		{},
	);
	const [deletedFile, setDeletedFile] = useState<string[]>([]);
	const [filesAdded, setFilesAdded] = useState<UpdFileI[]>([]);
	const { updateBill, isPending } = useUpdateBill();

	const { totalAmount, billDate, vendor } = useMemo(() => {
		const totalAmount = getTotalAmount(bill.products);
		const billDate = getBillDate(bill.products);
		const vendor = getVendor(bill.products);

		return { totalAmount, billDate, vendor };
	}, [bill.products]);

	const isFormValid = Object.values(fieldValidity).every(Boolean);

	const handleValidationChange = (name: string, valid: boolean) => {
		setFieldValidity((prev) => ({ ...prev, [name]: valid }));
	};

	const updateProduct = (index: number, field: keyof Product, value: any) => {
		setFormData((prev) => {
			const newProducts = [...prev.products];
			newProducts[index] = { ...newProducts[index], [field]: value };
			return { ...prev, products: newProducts };
		});
	};

	const handleSave = async () => {
		// Calculate changed fields
		const changedFields: any = {};

		// Diff Bill level fields
		(Object.keys(formData) as Array<keyof BillDetail>).forEach((key) => {
			if (key !== "products" && key !== "files") {
				if (formData[key] !== (bill as any)[key]) {
					changedFields[key] = formData[key];
				}
			}
		});

		// Diff Products
		const productChanges = formData.products
			.map((p, idx) => {
				const orig = bill.products[idx];
				const changes: any = {};
				(Object.keys(p) as Array<keyof Product>).forEach((k) => {
					if (orig && p[k] !== (orig as any)[k]) {
						changes[k] = p[k];
					} else if (!orig) {
						changes[k] = p[k];
					}
				});
				return Object.keys(changes).length > 0
					? { id: p.id, SK: p.SK, ...changes }
					: null;
			})
			.filter(Boolean);

		if (productChanges.length > 0) {
			changedFields.products = productChanges;
		}

		// Include file changes in changedFields log
		if (deletedFile.length > 0) {
			changedFields.deletedFiles = deletedFile;
		}
		if (filesAdded.length > 0) {
			// Iterate over filesAdded to only add details (File objects)
			changedFields.addedFiles = filesAdded.map((f) => {
				return {
					details: f.details,
					products: f.products,
				};
			});
		}

		// Log only fields whose value is changed
		await updateBill({ billNo: bill.billNo, ...changedFields }).then(() => {
			onSave();
		});
	};

	return (
		<>
			{/* Editing banner */}
			<div className="mb-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-bold tracking-widest shadow-sm">
				<EditIcon />
				EDITING MODE
			</div>

			<h1 className="text-3xl font-extrabold text-text-heading mb-2">
				Edit Bill Details
			</h1>
			<p className="text-base text-text-muted mb-2 leading-relaxed">
				Modify data from{" "}
				<span className="text-text-body font-semibold">
					Bill ({bill.products.length} Products)
				</span>{" "}
			</p>

			<div className="flex flex-col lg:flex-row gap-10">
				<LeftView
					formData={formData}
					updateProduct={updateProduct}
					handleValidationChange={handleValidationChange}
					CLOUDFRONT_DOMAIN={CLOUDFRONT_DOMAIN}
				/>
				<RightView
					bill={bill}
					formData={formData}
					totalAmount={totalAmount}
					billDate={billDate}
					vendor={vendor}
					deletedFile={deletedFile}
					filesAdded={filesAdded}
					setDeletedFile={setDeletedFile}
					setFilesAdded={setFilesAdded}
					isPending={isPending}
					onCancel={onCancel}
					onSave={onSave}
					isFormValid={isFormValid}
					handleSave={handleSave}
				/>
			</div>
		</>
	);
};

export default EditView;
