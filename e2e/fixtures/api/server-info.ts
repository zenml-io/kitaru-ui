import type { components } from "@/shared/api/openapi";

type ServerModel = components["schemas"]["ServerModel"];

export function makeServerInfo(
	overrides: Partial<ServerModel> = {}
): ServerModel {
	return {
		version: "0.0.0",
		auth_scheme: "OAUTH2_PASSWORD_BEARER",
		active: true,
		...overrides,
	};
}
