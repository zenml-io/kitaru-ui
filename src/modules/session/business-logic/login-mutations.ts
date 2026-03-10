import type { LoginPayload } from "@/modules/session/domain/login-schema";
import { loginUser } from "@/modules/session/domain/login-user";
import { type LoginSuccessResponse } from "@/modules/session/domain/types";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useLoginUser(
	options?: Omit<
		UseMutationOptions<LoginSuccessResponse, FetchError, LoginPayload, unknown>,
		"mutationFn"
	>
) {
	return useMutation({
		...options,
		mutationFn: loginUser,
	});
}
