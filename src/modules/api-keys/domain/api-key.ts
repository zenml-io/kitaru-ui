import type { components } from "@/shared/api/openapi";
import { parseBackendTimestamp } from "@/shared/utils/time";

export type ApiKey = {
	id: string;
	name: string;
	description?: string;
	active?: boolean;
	lastLogin?: Date;
	lastRotated?: Date;
	createdAt?: Date;
	updatedAt?: Date;
	/** Only set immediately after create or rotate; never persisted in the list. */
	plaintextKey?: string;
};

export function apiKeyFromApiToDomain(
	apiKey: components["schemas"]["APIKeyResponse"]
): ApiKey {
	const description = apiKey.metadata?.description;
	return {
		id: apiKey.id,
		name: apiKey.name,
		description:
			description && description.trim().length > 0 ? description : undefined,
		active: apiKey.body?.active ?? undefined,
		lastLogin: apiKey.metadata?.last_login
			? parseBackendTimestamp(apiKey.metadata.last_login)
			: undefined,
		lastRotated: apiKey.metadata?.last_rotated
			? parseBackendTimestamp(apiKey.metadata.last_rotated)
			: undefined,
		createdAt: apiKey.body?.created
			? parseBackendTimestamp(apiKey.body.created)
			: undefined,
		updatedAt: apiKey.body?.updated
			? parseBackendTimestamp(apiKey.body.updated)
			: undefined,
		plaintextKey: apiKey.body?.key ?? undefined,
	};
}
