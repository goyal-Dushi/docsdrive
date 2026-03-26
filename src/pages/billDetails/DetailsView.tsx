import { useState } from "react";
import type { BillDetail } from "@/types/bill";
import EditView from "./EditView";
import ReadOnlyView from "./ReadOnlyView";

interface DetailsViewProps {
	data: BillDetail;
	onEditDone: () => void;
}

const DetailsView: React.FC<DetailsViewProps> = (props) => {
	const { data, onEditDone } = props;

	const [isEditing, setIsEditing] = useState(false);

	const handleEdit = () => {
		setIsEditing((prev) => {
			return !prev;
		});
		onEditDone();
	};

	if (isEditing) {
		return (
			<EditView
				bill={data}
				onCancel={() => setIsEditing(false)}
				onSave={handleEdit}
			/>
		);
	}

	return <ReadOnlyView data={data} onEdit={handleEdit} />;
};

export default DetailsView;
