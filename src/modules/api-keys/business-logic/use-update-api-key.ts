import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";

import type { ApiKey } from "../domain/api-key";
import {
	updateApiKeyRequest,
	type UpdateApiKeyPayload,
} from "../domain/update-api-key";

export function useUpdateApiKey(
	options?: Omit<
		UseMutationOptions<ApiKey, FetchError, UpdateApiKeyPayload, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload) => updateApiKeyRequest(payload, { kitaruApiClient }),
	});
	return {
		...mutation,
		updateApiKey: mutation.mutate,
		updateApiKeyAsync: mutation.mutateAsync,
	};
}
