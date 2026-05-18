import { queryOptions } from "@tanstack/react-query";
import { fetchBuild } from "../domain/fetch-build";

export const buildsQueryKeys = {
	base: ["builds"] as const,
	detail: (buildId: string) =>
		[...buildsQueryKeys.base, "detail", buildId] as const,
};

export const buildsQueries = {
	detail: (buildId: string) =>
		queryOptions({
			queryKey: buildsQueryKeys.detail(buildId),
			queryFn: () => fetchBuild(buildId),
		}),
};
