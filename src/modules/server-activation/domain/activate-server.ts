import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type { components } from "@zenml/shared-kitaru/api/openapi";
import type { ServerActivationRequest } from "./server-activation-types";

export type ActivateServerResponse =
	| components["schemas"]["UserResponse"]
	| null;

export type ActivateServerArgs = ServerActivationRequest;

export async function activateServer(
	payload: ActivateServerArgs,
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const response = await kitaruApiClient.PUT("/api/v1/activate", {
		body: payload,
	});
	return expectData(response);
}
