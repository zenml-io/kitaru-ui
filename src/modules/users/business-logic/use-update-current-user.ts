import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { UserUpdate } from "../domain/users";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { updateCurrentUserRequest } from "../domain/update-current-user";

export function useUpdateCurrentUser(
	options?: Omit<
		UseMutationOptions<UserUpdate, FetchError, UserUpdate, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: updateCurrentUserRequest,
	});

	return {
		...mutation,
		updateCurrentUser: mutation.mutate,
		updateCurrentUserAsync: mutation.mutateAsync,
	};
}
