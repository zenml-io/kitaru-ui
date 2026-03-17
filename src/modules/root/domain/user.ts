import type { components } from "@/shared/api/openapi";

export type User = {
	id: string;
	name: string;
	fullName?: string;
};

export function userFromApiToDomain(
	user: components["schemas"]["UserResponse"]
): User {
	return {
		id: user.id,
		name: user.name,
		fullName: user.body?.full_name,
	};
}
