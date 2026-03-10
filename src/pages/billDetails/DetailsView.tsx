import { useState } from "react";
import type { BillDetail } from "@/types/bill";
import EditView from "./components/EditView";
import ReadOnlyView from "./ReadOnlyView";

interface DetailsViewProps {
	data: BillDetail;
	setBillData: React.Dispatch<React.SetStateAction<BillDetail | null>>;
}

const DetailsView: React.FC<DetailsViewProps> = (props) => {
	const { data, setBillData } = props;

	const [isEditing, setIsEditing] = useState(false);

	const handleEdit = () => {
		setIsEditing((prev) => {
			return !prev;
		});
	};

	if (isEditing) {
		return (
			<EditView
				bill={data}
				onCancel={() => setIsEditing(false)}
				onSave={(updated) => {
					setBillData(updated);
					handleEdit();
				}}
			/>
		);
	}

	return <ReadOnlyView data={data} onEdit={handleEdit} />;
};

export default DetailsView;
