import { apiClient } from "@/shared/api/domain/api-client";
import { apiPaths } from "@/shared/api/domain/api-paths";
import type { LoginPayload } from "@/modules/session/domain/login-schema";
import type { LoginTokenResponse } from "@/modules/session/domain/types";

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
