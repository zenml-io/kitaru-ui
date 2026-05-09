import { z } from "zod";

export const envSchema = z.object({
	VITE_BACKEND_URL: z.url().trim().optional(),
	VITE_UI_VERSION: z.string().optional(),
	VITE_API_BASE_URL: z
		.url()
		.trim()
		.transform((value) => value.replace(/\/+$/, ""))
		.catch(""),
	VITE_ANALYTICS_SERVER_URL: z.url().trim().optional(),
	DEV_PROXY_COOKIE: z.string().trim().optional(),
	DEV_PROXY_AUTHORIZATION: z.string().trim().optional(),
	DEV_PROXY_CSRF_TOKEN: z.string().trim().optional(),
	DEV_PROXY_PROJECT_NAME_OR_ID: z.string().trim().optional(),
});
