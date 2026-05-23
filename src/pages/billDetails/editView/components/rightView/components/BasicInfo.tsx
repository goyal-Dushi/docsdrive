import React from "react";

interface BasicInfoProps {
	totalAmount: string | number;
	billDate: string;
	vendor: string;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
	totalAmount,
	billDate,
	vendor,
}) => {
	return (
		<div className="space-y-6">
			<div>
				<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
					Total Amount
				</p>
				<p className="text-2xl font-black text-[var(--color-text-heading)]">
					{totalAmount || "0.00"}
				</p>
			</div>
			<div>
				<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
					Bill Date
				</p>
				<p className="text-sm font-bold text-[var(--color-text-body)]">
					{billDate || "NA"}
				</p>
			</div>
			<div>
				<p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
					Vendor
				</p>
				<p className="text-sm font-bold text-[var(--color-text-body)]">
					{vendor || "NA"}
				</p>
			</div>
		</div>
	);
};

export default BasicInfo;
