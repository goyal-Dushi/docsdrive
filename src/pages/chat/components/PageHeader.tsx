import React from "react";
import { GoBackIcon } from "@/assets";
import StatusBadge from "./StatusBadge";

interface PageHeaderProps {
	onGoBack: () => void;
	status: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onGoBack, status }) => {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex flex-col items-start">
				<GoBackIcon onClick={onGoBack} />
				<h1 className="text-3xl font-extrabold text-text-heading mb-1">
					AI Assistant
				</h1>
				<p className="text-sm text-text-muted font-medium">
					Ask anything about your documents and appliance details.
				</p>
			</div>
			<StatusBadge status={status} />
		</div>
	);
};

export default PageHeader;
