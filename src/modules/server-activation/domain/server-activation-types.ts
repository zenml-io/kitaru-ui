import type { components } from "@/shared/api/openapi";

export type ServerActivationRequest =
	components["schemas"]["ServerActivationRequest"] & {
		admin_username: string;
		admin_password: string;
	};
