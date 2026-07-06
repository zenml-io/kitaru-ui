import type { components } from "@zenml/shared-kitaru/api/openapi";

export type ServerActivationRequest =
	components["schemas"]["ServerActivationRequest"] & {
		admin_username: string;
		admin_password: string;
	};
