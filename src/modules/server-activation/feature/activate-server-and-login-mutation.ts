import { activateServer } from "@/modules/server-activation/domain/activate-server";
import type { ServerActivationPayload } from "@/modules/server-activation/domain/server-activation-schema";
import { loginUser } from "@/modules/session/domain/login-user";
import type { LoginTokenResponse } from "@/modules/session/domain/types";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import {
	type UseMutationOptions,
	mutationOptions,
} from "@tanstack/react-query";

export async function activateServerAndLogin(
	payload: ServerActivationPayload
): Promise<LoginTokenResponse> {
	await activateServer(payload);
	return loginUser({
		username: payload.admin_username,
		password: payload.admin_password,
	});
}

export function activateServerAndLoginMutationOptions(
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
	return mutationOptions({
		...options,
		mutationFn: activateServerAndLogin,
	});
}
