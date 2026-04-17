import type { components } from "@/shared/api/openapi";
import { parseBackendTimestamp } from "@/shared/utils/time";

export type SecretKey = {
	key: string;
	value: string;
};

export type Secret = {
	id: string;
	name: string;
	shortId: string;
	authorId?: string;
	authorName?: string;
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
	const user = secret.resources?.user ?? undefined;
	return {
		id: secret.id,
		name: secret.name,
		shortId: secret.id.slice(0, 8),
		authorId: user?.id,
		authorName: user?.body?.full_name ?? user?.name,
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
