import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { FetchError } from "@/shared/api/domain/fetch-error";

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
	const mutation = useMutation({
		...options,
		mutationFn: deleteApiKeyRequest,
	});
	return {
		...mutation,
		deleteApiKey: mutation.mutate,
		deleteApiKeyAsync: mutation.mutateAsync,
	};
}
