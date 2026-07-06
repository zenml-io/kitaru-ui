import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { UserUpdate } from "../domain/users";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { updateCurrentUserRequest } from "../domain/update-current-user";

export function useUpdateCurrentUser(
	options?: Omit<
		UseMutationOptions<UserUpdate, FetchError, UserUpdate, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload: UserUpdate) =>
			updateCurrentUserRequest({ payload }, { kitaruApiClient }),
	});

	return {
		...mutation,
		updateCurrentUser: mutation.mutate,
		updateCurrentUserAsync: mutation.mutateAsync,
	};
}
