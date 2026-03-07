import { apiClient } from "@/shared/api/domain/api-client";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { components } from "@/shared/api/types";
import {
	type UseMutationOptions,
	mutationOptions,
} from "@tanstack/react-query";
import type { ServerActivationPayload } from "../server-activation-schema";

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

export function activateServerMutationOptions(
	options?: Omit<
		UseMutationOptions<
			ActivateServerResponse,
			FetchError,
			ServerActivationPayload,
			unknown
		>,
		"mutationFn"
	>
) {
	return mutationOptions({
		...options,
		mutationFn: activateServer,
	});
}
