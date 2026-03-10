export interface Bill {
	vendor: string;
	purchaseDate: string | null;
	billNo: string;
	status: string;
	total_products: number;
	products: BillProduct[];
	lastUpdated: string;
}

export interface BillProduct {
	productName: string;
	warrantyEnd: string;
}
