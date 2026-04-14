import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import {
	FLOW_ACTIVE_STATUSES,
	FLOW_COMPLETED_STATUSES,
	FLOW_FAILED_STATUSES,
} from "../business-logic/categorize-flow-status";
import { type Flow, type FlowStatusFilter, flowFromApiToDomain } from "./flow";

// TODO: Remove these constants and use the API pagination instead
const DEFAULT_PAGE = 1;
const MAX_PAGE_SIZE = 1000;

export const DEFAULT_FLOWS_SORT = "desc:latest_run";

const STATUS_CATEGORY_TO_BACKEND: Record<
	Exclude<FlowStatusFilter, "all">,
	readonly string[]
> = {
	running: FLOW_ACTIVE_STATUSES,
	failed: FLOW_FAILED_STATUSES,
	completed: FLOW_COMPLETED_STATUSES,
};

export type FetchFlowsParams = {
	name?: string;
	status?: FlowStatusFilter;
	sort?: string;
};

export async function fetchFlows(
	params: FetchFlowsParams = {}
): Promise<Flow[]> {
	const query: Record<string, unknown> = {
		page: DEFAULT_PAGE,
		size: MAX_PAGE_SIZE,
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

	const response = await apiClient.GET("/api/v1/pipelines", {
		params: { query },
	});
	const flowsPage = expectData(response);

	return flowsPage.items.map(flowFromApiToDomain);
}
