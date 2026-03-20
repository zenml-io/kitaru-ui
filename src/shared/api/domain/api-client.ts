import { env } from "@/modules/root/domain/env";
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "../openapi";
import { getCsrfToken } from "../utils/csrf-token-cookie";
import { throwFetchErrorFromResponse } from "../utils/throw-fetch-error-from-response";
import { FetchError } from "./fetch-error";

const defaultHeaders = {
	"Content-Type": "application/json",
	"Source-Context": "kitaru-ui",
};

const normalizedApiBaseUrl = env.VITE_API_BASE_URL;

export const apiClient = createClient<paths>({
	baseUrl: normalizedApiBaseUrl,
	credentials: "include",
	headers: defaultHeaders,
});

const csrfMiddleware: Middleware = {
	onRequest({ request }) {
		const csrfToken = getCsrfToken();
		if (!csrfToken) {
			return;
		}

		const headers = new Headers(request.headers);
		headers.set("X-CSRF-Token", csrfToken);

		return new Request(request, { headers });
	},
};

const errorHandlingMiddleware: Middleware = {
	async onResponse({ request, response }) {
		if (!response.ok) {
			await throwFetchErrorFromResponse({
				response,
				url: request.url,
				method: request.method,
			});
		}

		return response;
	},
	onError({ error, request }) {
		return new FetchError({
			status: 0,
			statusText: "REQUEST_FAILED",
			message: "Request failed before receiving a response",
			url: request.url,
			method: request.method,
			cause: error,
		});
	},
};

apiClient.use(csrfMiddleware);
apiClient.use(errorHandlingMiddleware);
