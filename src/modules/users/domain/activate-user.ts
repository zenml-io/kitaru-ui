import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import { userFromApiToDomain, type UserUpdate } from "./users";

export type ActivateUserParams = {
	userId: string;
	payload: UserUpdate & { password: string };
};

export async function activateUser({ payload, userId }: ActivateUserParams) {
	const response = await apiClient.PUT(
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
