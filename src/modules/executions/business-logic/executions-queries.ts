import { queryOptions } from "@tanstack/react-query";
import { fetchExecutions } from "../domain/fetch-executions";

export const executionsQueryKeys = {
	all: (flowId: string) => ["executions", flowId] as const,
};

export const executionsQueries = {
	all: (flowId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.all(flowId),
			queryFn: () => fetchExecutions(flowId),
		}),
};
