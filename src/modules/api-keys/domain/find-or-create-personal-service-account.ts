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

	try {
		const createResponse = await apiClient.POST("/api/v1/service_accounts", {
			body: {
				name,
				active: true,
				description: PERSONAL_SA_DESCRIPTION,
			},
		});
		return { id: expectData(createResponse).id };
	} catch (error) {
		if (error instanceof FetchError && error.status === 409) {
			const raced = await fetchSingleByName(name);
			if (raced) return { id: raced.id };
			throw new Error(
				"Could not set up your personal service account. Please try again."
			);
		}
		throw error;
	}
}

export async function findPersonalServiceAccount(
	userId: string
): Promise<PersonalServiceAccount | null> {
	const name = buildPersonalServiceAccountName(userId);
	const existing = await fetchSingleByName(name);
	return existing ? { id: existing.id } : null;
}
