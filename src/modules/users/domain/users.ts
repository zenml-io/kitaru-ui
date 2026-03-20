import type { components } from "@/shared/api/openapi";
import { parseBackendTimestamp } from "@/shared/utils/time";

export type User = {
	id: string;
	name: string;
	resolvedName: string;
	fullName?: string;
	avatarUrl?: string;
	email?: string;
	isAdmin?: boolean;
	isActive?: boolean;
	createdAt?: Date;
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
		isAdmin: user.body?.is_admin ?? undefined,
		isActive: user.body?.active ?? undefined,
		createdAt: user.body?.created
			? parseBackendTimestamp(user.body.created)
			: undefined,
	};
}

export type UserUpdate = components["schemas"]["UserUpdate"];

export type CreateUserDialogSuccess = {
	userId: string;
	activationToken: string;
	username: string;
};
