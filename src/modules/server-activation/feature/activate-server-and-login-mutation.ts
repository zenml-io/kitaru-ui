import { activateServer } from "@/modules/server-activation/domain/activate-server";
import type { ServerActivationPayload } from "@/modules/server-activation/domain/server-activation-schema";
import { loginUser } from "@/modules/session/domain/login-user";
import {
	expectLoginTokenResponse,
	type LoginTokenResponse,
} from "@/modules/session/domain/types";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export async function activateServerAndLogin(
	payload: ServerActivationPayload
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
			ServerActivationPayload,
			unknown
		>,
		"mutationFn"
	>
) {
	return useMutation({
		...options,
		mutationFn: activateServerAndLogin,
	});
}
