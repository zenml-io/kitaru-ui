export class FetchError extends Error {
	public status?: number;
	public statusText?: string;
	public url?: string;
	public method?: string;
	public details?: unknown;

	constructor({
		message,
		status,
		statusText,
		url,
		method,
		details,
		cause,
	}: {
		message: string;
		status?: number;
		statusText?: string;
		url: string;
		method?: string;
		details?: unknown;
		cause?: unknown;
	}) {
		super(message);
		Object.setPrototypeOf(this, FetchError.prototype);
		this.name = "FetchError";
		this.status = status;
		this.statusText = statusText;
		this.url = url;
		this.method = method;
		this.details = details;
		if (cause !== undefined) {
			(this as Error & { cause?: unknown }).cause = cause;
		}
	}
}

export function isFetchError(err: unknown): err is FetchError {
	return err instanceof FetchError;
}
