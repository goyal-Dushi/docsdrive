import type { FC } from "react";
import type { BillProduct } from "./types";
import { FileText } from "lucide-react";

const CLOUDFRONT_DOMAIN = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

interface BillImageSectionProps {
	products?: BillProduct[];
	files?: string[];
}

const renderMedia = (key: string) => {
	const lowercasekey = key.toLowerCase();
	const isNotImage = lowercasekey.includes(".pdf") || lowercasekey.includes(".doc") || lowercasekey.includes(".docx");

	if (isNotImage) {
		return (
			<div className="w-full h-full bg-gray-100 flex items-center justify-center">
				<FileText size={48} className="text-gray-400" />
			</div>
		);
	}

	return (
		<a
			href={`${CLOUDFRONT_DOMAIN}/${key}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<img
				src={`${CLOUDFRONT_DOMAIN}/${key}`}
				alt="attachment"
				className="w-full h-full object-cover bg-gray-100 transition-transform duration-500 group-hover:scale-105"
			/>
		</a>
	);
};

const BillImageSection: FC<BillImageSectionProps> = ({
	products = [],
	files = [],
}) => {
	const allImages = [
		...(products.map((product) => product.s3key).filter(Boolean) as string[]),
		...files,
	];
	const count = allImages.length;

	// Handle the "Zero State" separately as it's a different UI component
	if (count === 0) {
		return (
			<div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
				No Media Available
			</div>
		);
	}

	return (
		<div
			className={`relative grid gap-1 p-1 bg-gray-100 aspect-[4/3] transition-all duration-300
				${count === 1 ? "grid-cols-1" : ""}
				${count === 2 ? "grid-cols-2" : ""}
				${count >= 3 ? "grid-cols-3 grid-rows-2" : ""}
			`}
		>
			{allImages.slice(0, 5).map((image, idx) => (
				<div
					key={idx}
					className={`overflow-hidden bg-white transition-all
						${idx === 0 && count >= 3 ? "col-span-2 row-span-2 rounded-2xl" : "rounded-xl"}
						${idx === 0 && count === 1 ? "rounded-2xl" : ""}
						${idx === 0 && count === 2 ? "rounded-xl" : ""}
					`}
				>
					{renderMedia(image)}
				</div>
			))}

			{/* Overlay for 5+ images */}
			{count > 5 && (
				<div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm z-10">
					+{count - 5}
				</div>
			)}
		</div>
	);
};

export default BillImageSection;
