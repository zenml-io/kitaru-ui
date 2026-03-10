import type { LoginPayload } from "@/modules/session/domain/login-schema";
import type { LoginSuccessResponse } from "@/modules/session/domain/types";
import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export async function loginUser(
	payload: LoginPayload
): Promise<LoginSuccessResponse> {
	const response = await apiClient.POST("/api/v1/login", {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams(payload),
	});

	return expectData(response);
}
