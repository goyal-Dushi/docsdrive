export const encodeBillName = (billName: string) => {
	return billName.split(" ").join("_").toLowerCase();
};

export const decodeBillName = (billName: string) => {
	return billName
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};
