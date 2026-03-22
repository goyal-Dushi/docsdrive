export interface Product {
	id?: string;
	SK: string;
	purchaseDate?: string;
	warrantyStart?: string;
	lastUpdated?: string;
	gstPercent?: number;
	basePrice?: number;
	purchaserName?: string;
	modelNumber?: string;
	vendorName?: string;
	gstAmount?: number;
	paymentMode?: string;
	rawText?: string;
	vendorContact?: string;
	vendorAddress?: string;
	warrantyEnd?: string | null;
	serialNumber?: string | null;
	productName?: string;
	s3key?: string;
}

export interface BillDetail {
	id: string;
	billDate: string;
	billNo: string;
	products: Product[];
	files: string[];
}
