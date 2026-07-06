import { fetchServerInfo } from "@/modules/root/domain/fetch-server-info";
import { queryOptions } from "@tanstack/react-query";
import type { KitaruApiRuntime } from "@zenml/shared-kitaru/api";

export type ServerInfoQueryArgs = object;

export const serverInfoQueryKeys = {
	all: (scopeKey: string) => [scopeKey, "server-info"] as const,
	detail: (scopeKey: string) => [...serverInfoQueryKeys.all(scopeKey)] as const,
};

export const serverInfoQueries = {
	detail: ({ kitaruApiClient, scopeKey }: KitaruApiRuntime) =>
		queryOptions({
			queryKey: serverInfoQueryKeys.detail(scopeKey),
			queryFn: () => fetchServerInfo({ kitaruApiClient }),
		}),
};
