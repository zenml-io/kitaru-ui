import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";
import type { KitaruApiRuntime } from "@zenml/shared-kitaru/api";

import { fetchApiKeyList } from "../domain/fetch-api-key-list";

export type ApiKeyListQueryParams = {
	serviceAccountId: string;
};

export type ApiKeyListQueryConfig = Omit<
	UseQueryOptions<Awaited<ReturnType<typeof fetchApiKeyList>>>,
	"queryKey" | "queryFn"
>;

export const apiKeyQueryKeys = {
	all: (scopeKey: string) => [scopeKey, "api-keys"] as const,
	list: (scopeKey: string, serviceAccountId: string) =>
		[...apiKeyQueryKeys.all(scopeKey), "list", serviceAccountId] as const,
};

export const apiKeyQueries = {
	list: (
		{ serviceAccountId }: ApiKeyListQueryParams,
		{ kitaruApiClient, scopeKey }: KitaruApiRuntime,
		config: ApiKeyListQueryConfig = {}
	) =>
		queryOptions({
			queryKey: apiKeyQueryKeys.list(scopeKey, serviceAccountId),
			queryFn: () => fetchApiKeyList({ serviceAccountId }, { kitaruApiClient }),
			...config,
		}),
};
