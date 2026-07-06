import { expectOptionalData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";

type DeleteUserRequestArgs = {
	userNameOrId: string;
};

export async function deleteUserRequest(
	{ userNameOrId }: DeleteUserRequestArgs,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<unknown | undefined> {
	const response = await kitaruApiClient.DELETE(
		"/api/v1/users/{user_name_or_id}",
		{
			params: {
				path: {
					user_name_or_id: userNameOrId,
				},
			},
		}
	);

	return expectOptionalData(response);
}
