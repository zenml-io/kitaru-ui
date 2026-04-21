import type { components } from "@/shared/api/openapi";
import { makeUser } from "./current-user";

type SecretResponse = components["schemas"]["SecretResponse"];
type SecretPage = components["schemas"]["Page_SecretResponse_"];

export function makeSecret(
	overrides: Partial<SecretResponse> = {}
): SecretResponse {
	const {
		body: bodyOverrides,
		resources: resourceOverrides,
		...rest
	} = overrides;
	return {
		id: "11111111-1111-1111-1111-111111111111",
		name: "demo-secret",
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			values: { api_key: "abc", region: "us-east-1" },
			...bodyOverrides,
		},
		resources: {
			user: makeUser(),
			...resourceOverrides,
		},
		...rest,
	};
}

export function makeSecretsPage(items: SecretResponse[] = []): SecretPage {
	return {
		index: 1,
		max_size: 1000,
		total_pages: 1,
		total: items.length,
		items,
	};
}
