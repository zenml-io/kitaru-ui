import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { deleteExecutionRequest } from "../domain/delete-execution";

export function useDeleteExecution(
	options?: Omit<
		UseMutationOptions<unknown | undefined, FetchError, string, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: deleteExecutionRequest,
	});

	return {
		...mutation,
		deleteExecution: mutation.mutate,
		deleteExecutionAsync: mutation.mutateAsync,
	};
}
