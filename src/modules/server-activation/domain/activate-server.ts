import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { components } from "@/shared/api/openapi";
import type { ServerActivationPayload } from "@/modules/server-activation/domain/server-activation-schema";

export type ActivateServerResponse =
	| components["schemas"]["UserResponse"]
	| null;

export async function activateServer(
	payload: ServerActivationPayload
): Promise<ActivateServerResponse> {
	const response = await apiClient.PUT("/api/v1/activate", {
		body: payload,
	});
	return expectData(response);
}
