import type { components } from "@/shared/api/openapi";
import { type User, userFromApiToDomain } from "@/modules/users/domain/users";
import { parseBackendTimestamp } from "@/shared/utils/time";

export type SecretKey = {
	key: string;
	value: string;
};

export type Secret = {
	id: string;
	name: string;
	shortId: string;
	user?: User;
	isPrivate?: boolean;
	keys: SecretKey[];
	createdAt?: Date;
};

function valuesToKeys(
	values: { [key: string]: unknown } | undefined | null
): SecretKey[] {
	if (!values) return [];
	return Object.entries(values).map(([key, value]) => ({
		key,
		value: typeof value === "string" ? value : JSON.stringify(value),
	}));
}

export function secretFromApiToDomain(
	secret: components["schemas"]["SecretResponse"]
): Secret {
	return {
		id: secret.id,
		name: secret.name,
		shortId: secret.id.slice(0, 8),
		user: secret.resources?.user
			? userFromApiToDomain(secret.resources.user)
			: undefined,
		isPrivate: secret.body?.private ?? undefined,
		keys: valuesToKeys(secret.body?.values),
		createdAt: secret.body?.created
			? parseBackendTimestamp(secret.body.created)
			: undefined,
	};
}

export type SecretValuesPayload = Record<string, string>;

export function keysToValuesPayload(keys: SecretKey[]): SecretValuesPayload {
	return Object.fromEntries(keys.map((k) => [k.key, k.value]));
}
