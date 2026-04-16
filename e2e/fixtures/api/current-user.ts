import type { components } from "@/shared/api/openapi";

type UserResponse = components["schemas"]["UserResponse"];

export function makeUser(overrides: Partial<UserResponse> = {}): UserResponse {
	return {
		id: "00000000-0000-0000-0000-000000000001",
		name: "test-user",
		body: {
			created: "2024-01-01T00:00:00Z",
			updated: "2024-01-01T00:00:00Z",
			is_service_account: false,
			is_admin: false,
		},
		...overrides,
	};
}
