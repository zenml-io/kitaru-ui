import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { logoutUser as logoutUserRequest } from "../domain/logout-user";

export function useLogoutUser(
	options?: Omit<
		UseMutationOptions<unknown, FetchError, void, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: logoutUserRequest,
	});

	return {
		...mutation,
		logoutUser: mutation.mutate,
		logoutUserAsync: mutation.mutateAsync,
	};
}
