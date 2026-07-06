import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import {
	createUserRequest,
	type CreateUserParams,
} from "../domain/create-user";
import type { CreateUserDialogSuccess } from "../domain/users";

export function useCreateUser(
	options?: Omit<
		UseMutationOptions<
			CreateUserDialogSuccess,
			FetchError,
			CreateUserParams,
			unknown
		>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (params: CreateUserParams) =>
			createUserRequest(params, { kitaruApiClient }),
	});

	return {
		...mutation,
		createUser: mutation.mutate,
		createUserAsync: mutation.mutateAsync,
	};
}
