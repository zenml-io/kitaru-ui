import type { components } from "@/shared/api/openapi";

type ApiKeyResponse = components["schemas"]["APIKeyResponse"];
type ApiKeyPage = components["schemas"]["Page_APIKeyResponse_"];
type ServiceAccountResponse = components["schemas"]["ServiceAccountResponse"];
type ServiceAccountPage = components["schemas"]["Page_ServiceAccountResponse_"];

export function makeServiceAccount(
	overrides: Partial<ServiceAccountResponse> = {}
): ServiceAccountResponse {
	const { body: bodyOverrides, ...rest } = overrides;
	return {
		id: "sa-11111111-1111-1111-1111-111111111111",
		name: "pat-user-1",
		body: {
			created: "2026-01-01T00:00:00Z",
			updated: "2026-01-01T00:00:00Z",
			active: true,
			...bodyOverrides,
		},
		...rest,
	};
}

export function makeServiceAccountPage(
	items: ServiceAccountResponse[] = []
): ServiceAccountPage {
	return {
		index: 1,
		max_size: 1,
		total_pages: items.length > 0 ? 1 : 0,
		total: items.length,
		items,
	};
}

export function makeApiKey(
	overrides: Partial<ApiKeyResponse> = {}
): ApiKeyResponse {
	const {
		body: bodyOverrides,
		metadata: metadataOverrides,
		...rest
	} = overrides;
	return {
		id: "ak-11111111-1111-1111-1111-111111111111",
		name: "demo-key",
		body: {
			created: "2026-01-01T00:00:00Z",
			updated: "2026-01-01T00:00:00Z",
			active: true,
			service_account: makeServiceAccount(),
			...bodyOverrides,
		},
		metadata: {
			description: "",
			retain_period_minutes: 0,
			...metadataOverrides,
		},
		...rest,
	};
}

export function makeApiKeyPage(items: ApiKeyResponse[] = []): ApiKeyPage {
	return {
		index: 1,
		max_size: 1000,
		total_pages: items.length > 0 ? 1 : 0,
		total: items.length,
		items,
	};
}
