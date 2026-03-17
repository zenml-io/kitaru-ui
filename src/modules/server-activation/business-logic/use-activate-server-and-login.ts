import { activateServer } from "@/modules/server-activation/domain/activate-server";
import { loginUser } from "@/modules/session/domain/login-user";
import {
	expectLoginTokenResponse,
	type LoginTokenResponse,
} from "@/modules/session/domain/types";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ServerActivationRequest } from "../domain/server-activation-types";

export async function activateServerAndLogin(
	payload: ServerActivationRequest
): Promise<LoginTokenResponse> {
	await activateServer(payload);
	const response = await loginUser({
		username: payload.admin_username,
		password: payload.admin_password,
	});
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
	const mutation = useMutation({
		...options,
		mutationFn: activateServerAndLogin,
	});

	return {
		...mutation,
		activateServerAndLogin: mutation.mutate,
		activateServerAndLoginAsync: mutation.mutateAsync,
	};
}
