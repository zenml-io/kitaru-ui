import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type { CreateUserDialogSuccess } from "./users";

export type CreateUserParams = {
	name: string;
	is_admin: boolean;
};

type CreateUserRequestArgs = CreateUserParams;

export async function createUserRequest(
	params: CreateUserRequestArgs,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<CreateUserDialogSuccess> {
	const response = await kitaruApiClient.POST("/api/v1/users", {
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
