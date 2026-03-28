import type { SVGProps } from "react";

const HomeSvg: React.FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
	return (
		<svg
			width={30}
			height={30}
			viewBox="0 0 96 96"
			fill="none"
			color="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<defs>
				<linearGradient
					id="driveGreen"
					x1="20"
					y1="10"
					x2="54"
					y2="70"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#34A853" />
					<stop offset="100%" stopColor="#1E8E3E" />
				</linearGradient>
				<linearGradient
					id="driveYellow"
					x1="64"
					y1="18"
					x2="76"
					y2="78"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#FBBC04" />
					<stop offset="100%" stopColor="#F29900" />
				</linearGradient>
				<linearGradient
					id="driveBlue"
					x1="16"
					y1="78"
					x2="78"
					y2="78"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#4285F4" />
					<stop offset="100%" stopColor="#1A73E8" />
				</linearGradient>
				<linearGradient
					id="houseGrad"
					x1="48"
					y1="28"
					x2="48"
					y2="68"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stopColor="#FFFFFF" />
					<stop offset="100%" stopColor="#E8F0FE" />
				</linearGradient>
				<filter
					id="softShadow"
					x="0"
					y="0"
					width="96"
					height="96"
					filterUnits="userSpaceOnUse"
				>
					<feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.18" />
				</filter>
			</defs>

			{/* Google Drive inspired outer mark */}
			<g filter="url(#softShadow)">
				<path d="M34 10H58L74 38H50L34 10Z" fill="url(#driveGreen)" />
				<path d="M58 10L74 38L62 58L46 30L58 10Z" fill="url(#driveYellow)" />
				<path d="M22 58L34 38H74L62 58H22Z" fill="url(#driveBlue)" />
				<path
					d="M22 58L34 38L46 58L34 78L22 58Z"
					fill="#188038"
					opacity="0.12"
				/>
			</g>

			{/* Center modern home badge */}
			<g>
				<circle cx="48" cy="50" r="20" fill="url(#houseGrad)" />
				<path
					d="M39 50L48 42L57 50"
					fill="none"
					stroke="#1A73E8"
					strokeWidth="3.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M41 50V60C41 60.55 41.45 61 42 61H54C54.55 61 55 60.55 55 60V50"
					fill="#FFFFFF"
					stroke="#1A73E8"
					strokeWidth="3.5"
					strokeLinejoin="round"
				/>
				<rect x="46" y="54" width="4" height="7" rx="1.2" fill="#34A853" />
			</g>

			{/* subtle highlight */}
			<path d="M36 15H54L64 31H46L36 15Z" fill="#FFFFFF" opacity="0.12" />
		</svg>
	);
};

export default HomeSvg;
