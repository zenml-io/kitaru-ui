import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { logoutUser as logoutUserRequest } from "../domain/logout-user";

export function useLogoutUser(
	options?: Omit<
		UseMutationOptions<unknown, FetchError, void, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: () => logoutUserRequest({ kitaruApiClient }),
	});

	return {
		...mutation,
		logoutUser: mutation.mutate,
		logoutUserAsync: mutation.mutateAsync,
	};
}
