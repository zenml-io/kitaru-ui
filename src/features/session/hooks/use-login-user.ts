import { apiClient } from "@/shared/api/domain/api-client";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { LoginPayload } from "../domain/login-schema";
import type { LoginTokenResponse } from "../domain/types";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { FetchError } from "@/shared/api/domain/fetch-error";

export async function loginUser(payload: LoginPayload) {
	const response = await apiClient(apiPaths.login, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams(payload),
	});
	const body: LoginTokenResponse = await response.json();
	return body;
}

export function useLoginUser(
	options?: UseMutationOptions<
		LoginTokenResponse,
		FetchError,
		LoginPayload,
		unknown
	>
) {
	return useMutation<LoginTokenResponse, FetchError, LoginPayload, unknown>({
		...options,
		mutationFn: async (payload) => {
			return loginUser(payload);
		},
	});
}
