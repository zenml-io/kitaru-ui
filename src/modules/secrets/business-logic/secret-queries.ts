import { queryOptions } from "@tanstack/react-query";

import { fetchSecret } from "../domain/fetch-secret";
import { fetchSecretList } from "../domain/fetch-secret-list";

export const secretQueryKeys = {
	all: ["secrets"] as const,
	list: () => [...secretQueryKeys.all, "list"] as const,
	detail: (secretId: string) =>
		[...secretQueryKeys.all, "detail", secretId] as const,
};

export const secretQueries = {
	list: () =>
		queryOptions({
			queryKey: secretQueryKeys.list(),
			queryFn: fetchSecretList,
		}),
	detail: (secretId: string) =>
		queryOptions({
			queryKey: secretQueryKeys.detail(secretId),
			queryFn: () => fetchSecret(secretId),
		}),
};
