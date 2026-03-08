import { FileSvg, ImgIconSvg } from "@/assets";

interface DisplayFileIconProps {
	name: string;
}

const DisplayFileIcon: React.FC<DisplayFileIconProps> = (props) => {
	const { name } = props;
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	if (ext === "pdf") {
		return (
			<div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 shadow-sm">
				<FileSvg />
			</div>
		);
	}
	if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
		return (
			<div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0 border border-green-200 shadow-sm">
				<ImgIconSvg />
			</div>
		);
	}
	return null;
};

export default DisplayFileIcon;
