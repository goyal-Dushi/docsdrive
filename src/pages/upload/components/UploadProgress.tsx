import { ExclamationIcon } from "@/assets";

interface UploadProgressProps {
	progress: string | null;
	error?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = (props) => {
	const { progress, error } = props;

	if (!progress && !error) return null;

	if (error) {
		return (
			<div className="mb-8 p-6 rounded-2xl bg-error-bg border border-error text-error text-sm font-bold flex items-center gap-3 shadow-sm">
				<ExclamationIcon />
				{error}
			</div>
		);
	}

	return (
		<div className="mb-8 p-6 rounded-2xl bg-info-bg border border-info text-info text-sm font-bold flex items-center gap-4 shadow-sm">
			<div className="w-5 h-5 border-3 border-info border-t-transparent rounded-full animate-spin shrink-0" />
			{progress}
		</div>
	);
};

export default UploadProgress;
