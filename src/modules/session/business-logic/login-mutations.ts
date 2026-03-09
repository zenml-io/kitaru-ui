import { loginUser } from "@/modules/session/domain/login-user";
import type { LoginPayload } from "@/modules/session/domain/login-schema";
import type { LoginTokenResponse } from "@/modules/session/domain/types";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import {
	type UseMutationOptions,
	mutationOptions,
} from "@tanstack/react-query";

export function loginMutationOptions(
	options?: Omit<
		UseMutationOptions<LoginTokenResponse, FetchError, LoginPayload, unknown>,
		"mutationFn"
	>
) {
	return mutationOptions({
		...options,
		mutationFn: loginUser,
	});
}
