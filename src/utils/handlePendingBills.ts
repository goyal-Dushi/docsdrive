export const PENDING_BILLS_LS = "pending_bills";

export const getPendingBills = (): string[] => {
	const bills = window.localStorage.getItem(PENDING_BILLS_LS);
	if (!bills) return [];
	return bills
		.split(",")
		.map((b) => b.trim())
		.filter(Boolean);
};

export const updatePendingBills = (billNo: string) => {
	const current = getPendingBills();
	if (!current.includes(billNo)) {
		const next = [...current, billNo];
		window.localStorage.setItem(PENDING_BILLS_LS, next.join(","));
	}
};

export const deletePendingBills = (billNo: string) => {
	const current = getPendingBills();
	const next = current.filter((b) => b !== billNo);
	if (next.length === 0) {
		window.localStorage.removeItem(PENDING_BILLS_LS);
	} else {
		window.localStorage.setItem(PENDING_BILLS_LS, next.join(","));
	}
};

export const clearPendingBills = () => {
	window.localStorage.removeItem(PENDING_BILLS_LS);
};
