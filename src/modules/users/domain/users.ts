import type { components } from "@/shared/api/openapi";

export type User = {
	id: string;
	name: string;
	resolvedName: string;
	fullName?: string;
	avatarUrl?: string;
	email?: string;
};

export function userFromApiToDomain(
	user: components["schemas"]["UserResponse"]
): User {
	return {
		id: user.id,
		name: user.name,
		resolvedName: user.body?.full_name || user.name,
		fullName: user.body?.full_name,
		avatarUrl: user.body?.avatar_url ?? undefined,
		email: user.metadata?.email ?? undefined,
	};
}

export type UpdateCurrentUser = components["schemas"]["UserUpdate"];
