import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import type { UserUpdate } from "./users";

type UpdateCurrentUserRequestArgs = {
	payload: UserUpdate;
};

export async function updateCurrentUserRequest(
	{ payload }: UpdateCurrentUserRequestArgs,
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const response = await kitaruApiClient.PUT("/api/v1/current-user", {
		body: payload,
	});
	return expectData(response);
}
