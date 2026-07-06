import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { deleteUserRequest } from "../domain/delete-user";

export function useDeleteUser(
	options?: Omit<
		UseMutationOptions<unknown | undefined, FetchError, string, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (userNameOrId: string) =>
			deleteUserRequest({ userNameOrId }, { kitaruApiClient }),
	});

	return {
		...mutation,
		deleteUser: mutation.mutate,
		deleteUserAsync: mutation.mutateAsync,
	};
}
