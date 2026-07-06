import { loginUser } from "@/modules/session/domain/login-user";
import type { LoginSuccessResponse } from "@/modules/session/domain/types";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
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
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (params: ActivateUserParams) =>
			activateUserAndLogin(params, { kitaruApiClient }),
	});

	return {
		...mutation,
		activateUser: mutation.mutate,
		activateUserAsync: mutation.mutateAsync,
	};
}

async function activateUserAndLogin(
	params: ActivateUserParams,
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const user = await activateUser(params, { kitaruApiClient });
	const loginResponse = await loginUser(
		{
			username: user.name,
			password: params.payload.password,
		},
		{ kitaruApiClient }
	);
	return loginResponse;
}
