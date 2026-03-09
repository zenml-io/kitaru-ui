import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { components } from "@/shared/api/types";
import type { ServerActivationPayload } from "@/modules/server-activation/domain/server-activation-schema";

export type ActivateServerResponse =
	| components["schemas"]["UserResponse"]
	| null;

export async function activateServer(
	payload: ServerActivationPayload
): Promise<ActivateServerResponse> {
	const response = await apiClient(apiPaths.activateServer, {
		method: "PUT",
		body: JSON.stringify(payload),
	});
	const body: ActivateServerResponse = await response.json();
	return body;
}
