import type { SVGProps } from "react";

const TrashBinSvg: React.FC<SVGProps<SVGSVGElement>> = (props) => {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
			<path d="M9 6V4h6v2" />
		</svg>
	);
};

export default TrashBinSvg;
