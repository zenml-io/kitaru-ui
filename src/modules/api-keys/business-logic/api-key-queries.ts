import { queryOptions } from "@tanstack/react-query";

import { fetchApiKeyList } from "../domain/fetch-api-key-list";

export const apiKeyQueryKeys = {
	all: ["api-keys"] as const,
	list: (serviceAccountId: string) =>
		[...apiKeyQueryKeys.all, "list", serviceAccountId] as const,
};

export const apiKeyQueries = {
	list: (serviceAccountId: string) =>
		queryOptions({
			queryKey: apiKeyQueryKeys.list(serviceAccountId),
			queryFn: () => fetchApiKeyList(serviceAccountId),
		}),
};
