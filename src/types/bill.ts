export interface Product {
	id?: string;
	purchaseDate?: string;
	warrantyStart?: string;
	lastUpdated?: string;
	gstPercent?: number;
	status?: string;
	basePrice?: number;
	groupName?: string;
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
	billNumber: string;
	vendor: string;
	totalAmount: string;
	billDate: string;
	pdfUrl: string;
	pdfName: string;
	pdfSize: string;
	products: Product[];
}
