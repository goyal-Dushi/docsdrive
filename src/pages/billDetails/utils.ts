import type { BillDetail } from "@/types/bill";

export const getVendor = (products: BillDetail["products"]) => {
	return products.find((p) => p.vendorName)?.vendorName || "NA";
};

export const getBillDate = (products: BillDetail["products"]) => {
	return products.find((p) => p.purchaseDate)?.purchaseDate || "NA";
};

export const getFileName = (s3Key: string) => {
	const lastPart = s3Key.split("/").pop() || "";
	const parts = lastPart.split("_");
	if (parts.length > 1) {
		return parts.slice(0, -1).join("_");
	}
	return lastPart;
};

export const getTotalAmount = (products: BillDetail["products"]) => {
	return products.reduce(
		(sum: number, p) =>
			sum + (Number(p.basePrice) || 0) + (Number(p.gstAmount) || 0),
		0,
	);
};
