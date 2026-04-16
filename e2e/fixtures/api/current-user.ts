import type { components } from "@/shared/api/openapi";

type UserResponse = components["schemas"]["UserResponse"];

export function makeUser(overrides: Partial<UserResponse> = {}): UserResponse {
	return {
		id: "user-1",
		name: "test-user",
		...overrides,
	};
}
