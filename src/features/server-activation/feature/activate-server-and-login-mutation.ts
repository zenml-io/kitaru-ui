import { activateServer } from "@/features/server-activation/domain/mutations/activate-server-mutation";
import type { ServerActivationPayload } from "@/features/server-activation/domain/server-activation-schema";
import { loginUser } from "@/features/session/domain/mutations/login-mutation";
import type { LoginTokenResponse } from "@/features/session/domain/types";
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
			Error,
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
