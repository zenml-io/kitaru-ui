import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
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
	const mutation = useMutation({
		...options,
		mutationFn: createUserRequest,
	});

	return {
		...mutation,
		createUser: mutation.mutate,
		createUserAsync: mutation.mutateAsync,
	};
}
