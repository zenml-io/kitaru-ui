import { apiClient } from "@/shared/api/domain/api-client";
import { FetchError } from "@/shared/api/domain/fetch-error";
import { expectData } from "@/shared/api/utils/unwrap-api-result";

export type PersonalServiceAccount = { id: string };

const PERSONAL_SA_DESCRIPTION =
	"Personal service account for UI-managed API keys.";

export function buildPersonalServiceAccountName(userId: string) {
	return `pat-${userId}`;
}

async function fetchSingleByName(name: string) {
	const response = await apiClient.GET("/api/v1/service_accounts", {
		params: {
			query: {
				name,
				size: 1,
				page: 1,
				hydrate: false,
			},
		},
	});
	const data = expectData(response);
	return data.items[0];
}

export async function findOrCreatePersonalServiceAccount(
	userId: string
): Promise<PersonalServiceAccount> {
	const name = buildPersonalServiceAccountName(userId);
	const existing = await fetchSingleByName(name);
	if (existing) return { id: existing.id };

	const createResponse = await apiClient.POST("/api/v1/service_accounts", {
		body: {
			name,
			active: true,
			description: PERSONAL_SA_DESCRIPTION,
		},
	});
	if (createResponse.error === undefined && createResponse.data) {
		return { id: createResponse.data.id };
	}
	if (createResponse.response.status === 409) {
		const raced = await fetchSingleByName(name);
		if (raced) return { id: raced.id };
	}
	throw new FetchError({
		status: createResponse.response.status,
		statusText: "Error while fetching data",
		message: `Could not provision personal service account: ${createResponse.response.url}`,
		url: createResponse.response.url,
		details: createResponse,
	});
}

export async function findPersonalServiceAccount(
	userId: string
): Promise<PersonalServiceAccount | null> {
	const name = buildPersonalServiceAccountName(userId);
	const existing = await fetchSingleByName(name);
	return existing ? { id: existing.id } : null;
}
