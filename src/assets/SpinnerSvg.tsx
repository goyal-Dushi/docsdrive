import type { SVGProps } from "react";

const SpinnerSvg: React.FC<SVGProps<SVGSVGElement>> = (props) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`animate-spin ${props.className || ""}`}
			{...props}
		>
			<circle cx="12" cy="12" r="10" opacity="0.25" />
			<path d="M12 2a10 10 0 0 1 10 10" />
		</svg>
	);
};

export default SpinnerSvg;
