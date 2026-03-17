import { loginUser } from "@/modules/session/domain/login-user";
import type { LoginSuccessResponse } from "@/modules/session/domain/types";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { activateUser, type ActivateUserParams } from "../domain/activate-user";

export function useActivateUserAndLogin(
	options?: Omit<
		UseMutationOptions<
			LoginSuccessResponse,
			FetchError,
			ActivateUserParams,
			unknown
		>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: activateUserAndLogin,
	});

	return {
		...mutation,
		activateUser: mutation.mutate,
		activateUserAsync: mutation.mutateAsync,
	};
}

async function activateUserAndLogin(params: ActivateUserParams) {
	const user = await activateUser(params);
	const loginResponse = await loginUser({
		username: user.name,
		password: params.payload.password,
	});
	return loginResponse;
}
