import { env } from "@/modules/root/domain/env";
import {
	createCsrfMiddleware,
	createErrorHandlingMiddleware,
	createKitaruApiClient,
} from "@zenml/shared-kitaru/api";
import { getCsrfToken } from "../utils/csrf-token-cookie";

const defaultHeaders: HeadersInit = {
	"Content-Type": "application/json",
	"Source-Context": "kitaru-ui",
};

const normalizedApiBaseUrl = env.VITE_API_BASE_URL;

export const apiClient = createKitaruApiClient({
	baseUrl: normalizedApiBaseUrl,
	credentials: "include",
	headers: defaultHeaders,
	middlewares: [
		createCsrfMiddleware(getCsrfToken),
		createErrorHandlingMiddleware(),
	],
});
