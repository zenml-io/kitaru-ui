import { queryOptions } from "@tanstack/react-query";
import { fetchStack } from "../domain/fetch-stack";

export const stacksQueryKeys = {
	base: ["stacks"] as const,
	detail: (stackId: string) =>
		[...stacksQueryKeys.base, "detail", stackId] as const,
};

export const stacksQueries = {
	detail: (stackId: string) =>
		queryOptions({
			queryKey: stacksQueryKeys.detail(stackId),
			queryFn: () => fetchStack(stackId),
		}),
};
