import { useRef } from "react";
import { NoFileIcon, TrashIcon, UploadIcon } from "@/assets";
import { Button, IconButton } from "@/components/button";
import DisplayFileIcon from "@/components/DisplayFileIcon";
import { formatBytes } from "@/utils";
import type { UploadedFile } from "../types";

interface DocumentUploadProps {
	files: UploadedFile[];
	setFiles: (files: UploadedFile[]) => void;
}

const DocumentUploadCard: React.FC<DocumentUploadProps> = (props) => {
	const { files, setFiles } = props;
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const newFiles = Array.from(e.target.files).map((f) => ({
			id: `${Date.now()}-${f.name}`,
			file: f,
		}));

		setFiles([...files, ...newFiles]);
		e.target.value = "";
	};

	const removeFile = (id: string) => {
		setFiles(files.filter((f) => f.id !== id));
	};

	return (
		<div className="flex-1 bg-bg-card rounded-3xl border border-border p-8 shadow-md">
			<div className="flex justify-between mb-10 pb-6 border-b border-border">
				<h2 className="text-xl font-bold text-text-heading">
					Document Uploads
				</h2>

				<Button
					label="Browse Local Files"
					variant="primary"
					icon={<UploadIcon />}
					iconPosition="start"
					onClick={() => inputRef.current?.click()}
				/>
			</div>

			<input
				ref={inputRef}
				type="file"
				multiple
				accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
				onChange={handleFileInput}
				className="hidden"
			/>

			{files.length === 0 ? (
				<div className="flex flex-col items-center gap-4 py-20 text-center border-2 border-dashed rounded-2xl">
					<NoFileIcon />
					<p className="text-sm text-text-muted">
						Upload PDFs, images, or Word documents
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{files.map(({ id, file }) => (
						<div
							key={id}
							className="flex items-center gap-5 p-5 rounded-2xl border"
						>
							<DisplayFileIcon name={file.name} />

							<div className="flex-1">
								<p className="text-sm font-bold truncate">{file.name}</p>
								<p className="text-xs text-text-muted">
									{formatBytes(file.size)}
								</p>
							</div>

							<IconButton
								icon={<TrashIcon />}
								tooltip="Remove file"
								onClick={() => removeFile(id)}
								className="text-error!"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default DocumentUploadCard;
