export interface PresignedUrlItem {
	url: string;
	fileKey: string;
	fileName: string;
}

export interface UploadResponse {
	presignedUrls: PresignedUrlItem[];
}

export interface UploadedFile {
	id: string;
	file: File;
}

export interface ProductEntry {
	id: string;
	name: string;
	image?: string;
	imageFile?: File;
}
