import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";

import type { ApiKey } from "../domain/api-key";
import {
	createApiKeyRequest,
	type CreateApiKeyPayload,
} from "../domain/create-api-key";

export function useCreateApiKey(
	options?: Omit<
		UseMutationOptions<ApiKey, FetchError, CreateApiKeyPayload, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload) => createApiKeyRequest(payload, { kitaruApiClient }),
	});
	return {
		...mutation,
		createApiKey: mutation.mutate,
		createApiKeyAsync: mutation.mutateAsync,
	};
}
