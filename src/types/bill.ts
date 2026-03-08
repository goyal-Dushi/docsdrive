export interface Product {
	id: string;
	image?: string;
	name: string;
	modelNumber: string;
	serialNumber: string;
	productName: string;
	vendorName: string;
	vendorAddress: string;
	purchaseDate: string;
	basePrice: string;
	gst: string;
	paymentMode: string;
	warrantyStart: string;
	warrantyEnd: string;
	rawText: string;
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
