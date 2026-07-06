import { activateServer } from "@/modules/server-activation/domain/activate-server";
import { loginUser } from "@/modules/session/domain/login-user";
import {
	expectLoginTokenResponse,
	type LoginTokenResponse,
} from "@/modules/session/domain/types";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ServerActivationRequest } from "../domain/server-activation-types";

export async function activateServerAndLogin(
	payload: ServerActivationRequest,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<LoginTokenResponse> {
	await activateServer(payload, { kitaruApiClient });
	const response = await loginUser(
		{
			username: payload.admin_username,
			password: payload.admin_password,
		},
		{ kitaruApiClient }
	);
	return expectLoginTokenResponse(response);
}

export function useActivateServerAndLogin(
	options?: Omit<
		UseMutationOptions<
			LoginTokenResponse,
			FetchError,
			ServerActivationRequest,
			unknown
		>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload) =>
			activateServerAndLogin(payload, { kitaruApiClient }),
	});

	return {
		...mutation,
		activateServerAndLogin: mutation.mutate,
		activateServerAndLoginAsync: mutation.mutateAsync,
	};
}
