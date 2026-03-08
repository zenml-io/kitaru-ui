import { FetchError } from "./fetch-error";
import { throwFetchErrorFromResponse } from "../utils/throw-fetch-error-from-response";

const defaultHeaders = {
	"Content-Type": "application/json",
	"Source-Context": "dashboard-v2",
};

function mergeHeaders(initHeaders?: HeadersInit): Headers {
	const mergedHeaders = new Headers(defaultHeaders);
	if (initHeaders) {
		const requestHeaders = new Headers(initHeaders);
		requestHeaders.forEach((value, key) => {
			mergedHeaders.set(key, value);
		});
	}
	return mergedHeaders;
}

export async function apiClient(endpoint: string, init?: RequestInit) {
	const url = `/api/v1${endpoint}`;
	const method = (init?.method ?? "GET").toUpperCase();
	const config: RequestInit = {
		credentials: "include",
		...init,
		headers: mergeHeaders(init?.headers),
	};

	let res: Response;
	try {
		res = await fetch(url, config);
	} catch (error) {
		throw new FetchError({
			status: 0,
			statusText: "REQUEST_FAILED",
			message: "Request failed before receiving a response",
			url,
			method,
			cause: error,
		});
	}

	if (!res.ok) {
		await throwFetchErrorFromResponse({
			response: res,
			url,
			method,
		});
	}

	return res;
}
