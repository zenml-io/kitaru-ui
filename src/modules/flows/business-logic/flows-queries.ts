import { queryOptions } from "@tanstack/react-query";
import {
	DEFAULT_FLOWS_SORT,
	type FetchFlowsParams,
	fetchFlows,
} from "../domain/fetch-flows";
import { fetchFlow } from "../domain/fetch-flow";

export const flowsQueryKeys = {
	all: ["flows"] as const,
	list: (params: FetchFlowsParams) => [...flowsQueryKeys.all, params] as const,
	detail: (flowId: string) => [...flowsQueryKeys.all, flowId] as const,
};

function normalizeParams(params: FetchFlowsParams): FetchFlowsParams {
	const trimmedName = params.name?.trim();
	const normalized: FetchFlowsParams = {};
	if (trimmedName) normalized.name = trimmedName;
	if (params.status && params.status !== "all") {
		normalized.status = params.status;
	}
	if (params.sort && params.sort !== DEFAULT_FLOWS_SORT) {
		normalized.sort = params.sort;
	}
	return normalized;
}

export const flowsQueries = {
	all: (params: FetchFlowsParams = {}) => {
		const normalized = normalizeParams(params);
		return queryOptions({
			queryKey: flowsQueryKeys.list(normalized),
			queryFn: () => fetchFlows(normalized),
		});
	},
	detail: (flowId: string) =>
		queryOptions({
			queryKey: flowsQueryKeys.detail(flowId),
			queryFn: () => fetchFlow(flowId),
		}),
};
