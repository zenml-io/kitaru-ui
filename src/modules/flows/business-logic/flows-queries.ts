import { queryOptions } from "@tanstack/react-query";
import { type FlowsQuery, fetchFlows } from "../domain/fetch-flows";
import { fetchFlow } from "../domain/fetch-flow";
import type { FlowStatusFilter } from "../domain/flow";
import {
	FLOW_ACTIVE_STATUSES,
	FLOW_COMPLETED_STATUSES,
	FLOW_FAILED_STATUSES,
} from "./categorize-flow-status";

export const DEFAULT_FLOWS_SORT = "desc:latest_run";

export const ALLOWED_FLOWS_SORT_FIELDS = [
	"name",
	"latest_run",
	"created",
] as const;

export type FetchFlowsParams = {
	name?: string;
	status?: FlowStatusFilter;
	sort?: string;
};

const STATUS_CATEGORY_TO_BACKEND: Record<
	Exclude<FlowStatusFilter, "all">,
	readonly string[]
> = {
	running: FLOW_ACTIVE_STATUSES,
	failed: FLOW_FAILED_STATUSES,
	completed: FLOW_COMPLETED_STATUSES,
};

function buildFlowsQuery(params: FetchFlowsParams): FlowsQuery {
	const query: FlowsQuery = {
		sort_by: params.sort ?? DEFAULT_FLOWS_SORT,
	};

	let filterCount = 0;

	const trimmedName = params.name?.trim();
	if (trimmedName) {
		query.name = `contains:${trimmedName}`;
		filterCount++;
	}

	if (params.status && params.status !== "all") {
		const backendValues = STATUS_CATEGORY_TO_BACKEND[params.status];
		query.latest_run_status = `oneof:${JSON.stringify(backendValues)}`;
		filterCount++;
	}

	if (filterCount > 1) {
		query.logical_operator = "and";
	}

	return query;
}

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
	list: (params: FetchFlowsParams = {}) => {
		const normalized = normalizeParams(params);
		return queryOptions({
			queryKey: flowsQueryKeys.list(normalized),
			queryFn: () => fetchFlows(buildFlowsQuery(normalized)),
		});
	},
	detail: (flowId: string) =>
		queryOptions({
			queryKey: flowsQueryKeys.detail(flowId),
			queryFn: () => fetchFlow(flowId),
		}),
};
