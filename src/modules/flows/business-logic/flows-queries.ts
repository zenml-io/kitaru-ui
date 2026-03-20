import { queryOptions } from "@tanstack/react-query";
import { fetchFlows } from "../domain/fetch-flows";
import { fetchFlow } from "../domain/fetch-flow";

export const flowsQueryKeys = {
	all: ["flows"] as const,
	detail: (flowId: string) => [...flowsQueryKeys.all, flowId] as const,
};

export const flowsQueries = {
	all: () =>
		queryOptions({
			queryKey: flowsQueryKeys.all,
			queryFn: fetchFlows,
		}),
	detail: (flowId: string) =>
		queryOptions({
			queryKey: flowsQueryKeys.detail(flowId),
			queryFn: () => fetchFlow(flowId),
		}),
};
