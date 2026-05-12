import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type { FetchError } from "@/shared/api/domain/fetch-error";

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
	const mutation = useMutation({
		...options,
		mutationFn: rotateApiKeyRequest,
	});
	return {
		...mutation,
		rotateApiKey: mutation.mutate,
		rotateApiKeyAsync: mutation.mutateAsync,
	};
}
