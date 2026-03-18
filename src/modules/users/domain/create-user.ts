import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { CreateUserDialogSuccess } from "./users";

export type CreateUserParams = {
	name: string;
	is_admin: boolean;
};

export async function createUserRequest(
	params: CreateUserParams
): Promise<CreateUserDialogSuccess> {
	const response = await apiClient.POST("/api/v1/users", {
		body: {
			name: params.name,
			is_admin: params.is_admin,
		},
	});

	const data = expectData(response);

	const activationToken = data.body?.activation_token ?? "";
	if (!activationToken) {
		throw new Error("Activation token not returned from API");
	}

	return {
		userId: data.id,
		username: data.name,
		activationToken,
	};
}
