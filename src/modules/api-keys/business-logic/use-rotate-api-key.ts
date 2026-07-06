import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";

import type { ApiKey } from "../domain/api-key";
import {
	rotateApiKeyRequest,
	type RotateApiKeyPayload,
} from "../domain/rotate-api-key";

export function useRotateApiKey(
	options?: Omit<
		UseMutationOptions<ApiKey, FetchError, RotateApiKeyPayload, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload) => rotateApiKeyRequest(payload, { kitaruApiClient }),
	});
	return {
		...mutation,
		rotateApiKey: mutation.mutate,
		rotateApiKeyAsync: mutation.mutateAsync,
	};
}
