import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import { userFromApiToDomain, type UserUpdate } from "./users";

export type ActivateUserParams = {
	userId: string;
	payload: UserUpdate & { password: string };
};

type ActivateUserArgs = ActivateUserParams;

export async function activateUser(
	{ payload, userId }: ActivateUserArgs,
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const response = await kitaruApiClient.PUT(
		"/api/v1/users/{user_name_or_id}/activate",
		{
			params: {
				path: {
					user_name_or_id: userId,
				},
			},
			body: payload,
		}
	);
	return userFromApiToDomain(expectData(response));
}
