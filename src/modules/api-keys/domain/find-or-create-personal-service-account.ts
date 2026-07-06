import { expectData } from "@zenml/shared-kitaru/api/utils/unwrap-api-result";
import type { KitaruApiClientContext } from "@zenml/shared-kitaru/api";
import { FetchError } from "@zenml/shared-kitaru/api/domain";

export type PersonalServiceAccount = { id: string };
export type PersonalServiceAccountParams = {
	userId: string;
};

const PERSONAL_SA_DESCRIPTION =
	"Personal service account for UI-managed API keys.";

export function buildPersonalServiceAccountName(userId: string) {
	return `pat-${userId}`;
}

async function fetchSingleByName(
	{ name }: { name: string },
	{ kitaruApiClient }: KitaruApiClientContext
) {
	const response = await kitaruApiClient.GET("/api/v1/service_accounts", {
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
	{ userId }: PersonalServiceAccountParams,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<PersonalServiceAccount> {
	const name = buildPersonalServiceAccountName(userId);
	const existing = await fetchSingleByName({ name }, { kitaruApiClient });
	if (existing) return { id: existing.id };

	try {
		const createResponse = await kitaruApiClient.POST(
			"/api/v1/service_accounts",
			{
				body: {
					name,
					active: true,
					description: PERSONAL_SA_DESCRIPTION,
				},
			}
		);
		return { id: expectData(createResponse).id };
	} catch (error) {
		if (error instanceof FetchError && error.status === 409) {
			const raced = await fetchSingleByName({ name }, { kitaruApiClient });
			if (raced) return { id: raced.id };
			throw new Error(
				"Could not set up your personal service account. Please try again."
			);
		}
		throw error;
	}
}

export async function findPersonalServiceAccount(
	{ userId }: PersonalServiceAccountParams,
	{ kitaruApiClient }: KitaruApiClientContext
): Promise<PersonalServiceAccount | null> {
	const name = buildPersonalServiceAccountName(userId);
	const existing = await fetchSingleByName({ name }, { kitaruApiClient });
	return existing ? { id: existing.id } : null;
}
