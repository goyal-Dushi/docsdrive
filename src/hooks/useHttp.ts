import xior, { type XiorError, type XiorInstance } from "xior";
import { getIdToken } from "@/utils";

export interface HttpError {
	message: string;
	status: number;
	code?: string;
}

function normalizeError(err: unknown): HttpError {
	const xiorErr = err as XiorError;
	if (xiorErr?.response) {
		const data = xiorErr.response.data as Record<string, unknown> | null;
		return {
			message:
				(data?.message as string) ||
				(data?.error as string) ||
				xiorErr.message ||
				"An error occurred",
			status: xiorErr.response.status,
			code: (data?.code as string) || String(xiorErr.response.status),
		};
	}
	if (xiorErr?.message) {
		return {
			message: xiorErr.message,
			status: 0,
			code: "NETWORK_ERROR",
		};
	}
	return {
		message: "An unknown error occurred",
		status: 0,
		code: "UNKNOWN",
	};
}

const env = import.meta.env.MODE;

const authHttp: XiorInstance = xior.create({
	baseURL:
		env === "development"
			? import.meta.env.VITE_API_GATEWAY_DOMAIN_DEV
			: import.meta.env.VITE_API_GATEWAY_DOMAIN_PROD,
	timeout: 30_000,
	headers: {},
});

authHttp.interceptors.request.use(async (config) => {
	try {
		const idToken = await getIdToken();
		const method = config.method?.toUpperCase() || "GET";
		if (method !== "GET") {
			config.headers = config.headers ?? {};
			config.headers["Content-Type"] = "application/json";
		}

		if (idToken) {
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${idToken}`;
		}

		if (!idToken) {
			console.error("Id token not found");
		}
	} catch (err) {
		console.error("Error fetching auth session: ", err);
	}
	return config;
});

authHttp.interceptors.response.use(
	(response) => response,
	(error: unknown) => {
		return Promise.reject(normalizeError(error));
	},
);

export const http = authHttp;

export function useHttp() {
	return http;
}

/**
 * Upload a single file to an S3 presigned PUT URL.
 * Does NOT attach Authorization header or Content-Type: application/json.
 */
export async function uploadToS3(
	presignedUrl: string,
	file: File,
): Promise<void> {
	console.log(file, file instanceof File, file.size);
	const res = await fetch(presignedUrl, {
		method: "PUT",
		body: file,
	});

	if (!res.ok) {
		throw new Error(`S3 upload failed: ${res.status}`);
	}
}
