import { Button } from "@/components/button";
import { getPendingBills } from "@/utils";
import usePerformAiAnalysis from "../../upload/hooks/usePerformAiAnalysis";

type PendingBillAnalysisBtnProps = {};

const PENDING_BILLS = getPendingBills();

const PendingBillAnalysisBtn: React.FC<PendingBillAnalysisBtnProps> = () => {
	const { mutate: performAnalysis, isPending } = usePerformAiAnalysis();

	const handleAnalysis = () => {
		performAnalysis({ billNo: PENDING_BILLS });
	};

	return (
		<Button
			label={`Analyze all Pending Bills (${PENDING_BILLS.length})`}
			variant="secondary"
			disabled={isPending}
			iconPosition="start"
			onClick={handleAnalysis}
			className="py-4 px-6 text-blue-500 shadow-xl shadow-blue-500/20"
		/>
	);
};

export default PendingBillAnalysisBtn;
