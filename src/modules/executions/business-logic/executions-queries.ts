import { queryOptions } from "@tanstack/react-query";
import { fetchExecutions } from "../domain/fetch-executions";

export const executionsQueryKeys = {
	all: ["executions"] as const,
};

export const executionsQueries = {
	all: () =>
		queryOptions({
			queryKey: executionsQueryKeys.all,
			queryFn: fetchExecutions,
		}),
};
