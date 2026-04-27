import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { FetchError } from "@/shared/api/domain/fetch-error";

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
	const mutation = useMutation({
		...options,
		mutationFn: updateApiKeyRequest,
	});
	return {
		...mutation,
		updateApiKey: mutation.mutate,
		updateApiKeyAsync: mutation.mutateAsync,
	};
}
