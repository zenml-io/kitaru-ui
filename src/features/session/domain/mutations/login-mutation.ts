import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import {
	type UseMutationOptions,
	mutationOptions,
} from "@tanstack/react-query";
import type { LoginPayload } from "../login-schema";
import type { LoginTokenResponse } from "../types";

export async function loginUser(
	payload: LoginPayload
): Promise<LoginTokenResponse> {
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
