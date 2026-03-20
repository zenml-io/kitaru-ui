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
});
