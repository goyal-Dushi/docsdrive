export interface UploadPromise {
	kind: "file" | "product";
	fileName?: string;
	productName?: string;
	uploadUrl: string;
	key: string;
}

export interface UploadResponse {
	urls: UploadPromise[];
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
