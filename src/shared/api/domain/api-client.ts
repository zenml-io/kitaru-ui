import createClient, { type Middleware } from "openapi-fetch";
import { FetchError } from "./fetch-error";
import type { paths } from "../openapi";
import { throwFetchErrorFromResponse } from "../utils/throw-fetch-error-from-response";

const defaultHeaders = {
	"Content-Type": "application/json",
	"Source-Context": "dashboard-v2",
};

export const apiClient = createClient<paths>({
	baseUrl: "",
	credentials: "include",
	headers: defaultHeaders,
});

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

apiClient.use(errorHandlingMiddleware);
