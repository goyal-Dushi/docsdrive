/**
 * Formats a date string into a human-readable format with an ordinal day suffix, short month name, and year.
 *
 * @param {string} dateStr - The date string to be formatted (YYYY-MM-DD).
 * @returns {string} The formatted date string (e.g., "1st Jan 2023").
 *  */
const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);

	// 1. Get the day and its ordinal suffix
	const day = date.getDate();
	const getSuffix = (n: number) => {
		if (n > 3 && n < 21) return "th"; // handles 11th-13th
		switch (n % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	// 2. Format the month and year natively
	const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
		date,
	);
	const year = date.getFullYear();

	return `${day}${getSuffix(day)} ${month} ${year}`;
};

export default formatDate;
