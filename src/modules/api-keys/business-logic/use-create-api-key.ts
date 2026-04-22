import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { FetchError } from "@/shared/api/domain/fetch-error";

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
	const mutation = useMutation({
		...options,
		mutationFn: createApiKeyRequest,
	});
	return {
		...mutation,
		createApiKey: mutation.mutate,
		createApiKeyAsync: mutation.mutateAsync,
	};
}
