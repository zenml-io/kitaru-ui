import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { deleteSecretRequest } from "../domain/delete-secret";

export function useDeleteSecret(
	options?: Omit<
		UseMutationOptions<void, FetchError, string, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: deleteSecretRequest,
	});

	return {
		...mutation,
		deleteSecret: mutation.mutate,
		deleteSecretAsync: mutation.mutateAsync,
	};
}
