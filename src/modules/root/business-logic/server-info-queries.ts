import { fetchServerInfo } from "@/modules/root/domain/fetch-server-info";
import { queryOptions } from "@tanstack/react-query";

export const serverInfoQueryKeys = {
	all: ["server-info"] as const,
	detail: () => [...serverInfoQueryKeys.all] as const,
};

export const serverInfoQueries = {
	detail: () =>
		queryOptions({
			queryKey: serverInfoQueryKeys.detail(),
			queryFn: fetchServerInfo,
		}),
};
