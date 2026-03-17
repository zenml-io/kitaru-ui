import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { deleteUserRequest } from "../domain/delete-user";

export function useDeleteUser(
	options?: Omit<
		UseMutationOptions<unknown | undefined, FetchError, string, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: deleteUserRequest,
	});

	return {
		...mutation,
		deleteUser: mutation.mutate,
		deleteUserAsync: mutation.mutateAsync,
	};
}
