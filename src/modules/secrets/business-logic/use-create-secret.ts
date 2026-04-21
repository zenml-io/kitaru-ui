import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { Secret } from "../domain/secrets";
import {
	createSecretRequest,
	type CreateSecretPayload,
} from "../domain/create-secret";

export function useCreateSecret(
	options?: Omit<
		UseMutationOptions<Secret, FetchError, CreateSecretPayload, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: createSecretRequest,
	});

	return {
		...mutation,
		createSecret: mutation.mutate,
		createSecretAsync: mutation.mutateAsync,
	};
}
