export interface Bill {
	vendor: string;
	purchaseDate: string | null;
	billNo: string;
	total_products: number;
	products: BillProduct[];
	lastUpdated: string;
	files: string[];
}

export interface BillProduct {
	productName: string;
	warrantyEnd: string;
	s3key: string;
}
