import type { LoginPayload } from "@/modules/session/domain/login-schema";
import {
	isLoginTokenResponse,
	type LoginSuccessResponse,
} from "@/modules/session/domain/types";
import {
	clearCsrfToken,
	setCsrfToken,
} from "@/shared/api/utils/csrf-token-cookie";
import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";

export type LoginUserArgs = LoginPayload;

export async function loginUser(
	payload: LoginUserArgs,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<LoginSuccessResponse> {
	const response = await kitaruApiClient.POST("/api/v1/login", {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams(payload),
	});

	const loginResponse = expectData(response);

	if (isLoginTokenResponse(loginResponse)) {
		if (loginResponse.csrf_token) {
			setCsrfToken(loginResponse.csrf_token);
		} else {
			clearCsrfToken();
		}
	}

	return loginResponse;
}
