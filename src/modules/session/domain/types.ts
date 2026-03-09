import type { components } from "@/shared/api/openapi";

export type LoginTokenResponse = components["schemas"]["OAuthTokenResponse"];
export type LoginRedirectResponse =
	components["schemas"]["OAuthRedirectResponse"];
export type LoginSuccessResponse = LoginTokenResponse | LoginRedirectResponse;

export function isLoginTokenResponse(
	response: LoginSuccessResponse
): response is LoginTokenResponse {
	return "access_token" in response;
}

export function expectLoginTokenResponse(
	response: LoginSuccessResponse
): LoginTokenResponse {
	if (isLoginTokenResponse(response)) {
		return response;
	}

	throw new Error(
		"Login returned a redirect response; token response is required in this flow."
	);
}
