import xior, { type XiorError, type XiorInstance } from "xior";

// ─── Normalized Error ─────────────────────────────────────────────────────────

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

// ─── Auth HTTP Instance (with interceptors) ───────────────────────────────────

const authHttp: XiorInstance = xior.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
	timeout: 30_000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor: attach bearer token from localStorage
authHttp.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Response interceptor: normalize errors
authHttp.interceptors.response.use(
	(response) => response,
	(error: unknown) => {
		return Promise.reject(normalizeError(error));
	},
);

// ─── Plain S3 Instance (NO interceptors, NO auth header) ─────────────────────

export const s3Http: XiorInstance = xior.create({
	timeout: 60_000,
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const http = authHttp;

/**
 * Custom hook providing access to the pre-configured HTTP client.
 *
 * Usage:
 *   const { http } = useHttp();
 *   useQuery({ queryKey: ['bills'], queryFn: () => http.get('/bills').then(r => r.data) })
 *
 * For S3 presigned URL uploads use `s3Http` imported directly, or the
 * `uploadToS3` helper below.
 */
export function useHttp() {
	return { http, s3Http };
}

/**
 * Upload a single file to an S3 presigned PUT URL.
 * Does NOT attach Authorization header or Content-Type: application/json.
 */
export async function uploadToS3(
	presignedUrl: string,
	file: File,
): Promise<void> {
	await s3Http.request({
		method: "PUT",
		url: presignedUrl,
		data: file,
		headers: {
			"Content-Type": file.type,
		},
	});
}
