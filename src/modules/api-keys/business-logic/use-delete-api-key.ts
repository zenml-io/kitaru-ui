import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";

import {
	deleteApiKeyRequest,
	type DeleteApiKeyPayload,
} from "../domain/delete-api-key";

export function useDeleteApiKey(
	options?: Omit<
		UseMutationOptions<void, FetchError, DeleteApiKeyPayload, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload) => deleteApiKeyRequest(payload, { kitaruApiClient }),
	});
	return {
		...mutation,
		deleteApiKey: mutation.mutate,
		deleteApiKeyAsync: mutation.mutateAsync,
	};
}
