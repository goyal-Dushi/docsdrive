import type { FC } from "react";
import { ChatIcon, TrashIcon, ViewIcon } from "@/assets";
import { IconButton } from "@/components/button";

interface BillFooterProps {
	onChat: () => void;
	onView: () => void;
	onDelete: () => void;
	isDeleting: boolean;
}

const BillFooter: FC<BillFooterProps> = ({
	onChat,
	onView,
	onDelete,
	isDeleting,
}) => (
	<div className="flex items-center justify-around px-2 py-2 border-t border-gray-100 bg-white">
		<IconButton
			icon={<ChatIcon size={18} />}
			onClick={onChat}
			tooltip="Chat with AI"
			className="text-gray-400 hover:text-primary hover:bg-gray-100 rounded-full transition-all"
		/>

		<IconButton
			icon={<ViewIcon size={18} />}
			onClick={onView}
			tooltip="View Details"
			className="text-gray-400 hover:text-primary hover:bg-gray-100 rounded-full transition-all"
		/>

		<IconButton
			icon={<TrashIcon size={18} />}
			onClick={onDelete}
			disabled={isDeleting}
			tooltip="Delete Bill"
			className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
		/>
	</div>
);

export default BillFooter;
