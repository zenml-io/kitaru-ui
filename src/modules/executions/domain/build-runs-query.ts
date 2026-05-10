import type { operations } from "@/shared/api/openapi";
import type { GlobalExecutionsQueryParams } from "./global-executions-query-params";

type RunsListQueryAll = NonNullable<
	operations["list_runs_api_v1_runs_get"]["parameters"]["query"]
>;

export type RunsListQuery = Pick<
	RunsListQueryAll,
	| "sort_by"
	| "page"
	| "size"
	| "status"
	| "pipeline_id"
	| "source_snapshot_id"
	| "stack_id"
	| "name"
	| "created"
	| "logical_operator"
>;

const RANGE_TO_MS: Record<"24h" | "7d" | "30d", number> = {
	"24h": 24 * 60 * 60 * 1000,
	"7d": 7 * 24 * 60 * 60 * 1000,
	"30d": 30 * 24 * 60 * 60 * 1000,
};

export function buildRunsQuery(
	params: GlobalExecutionsQueryParams
): RunsListQuery {
	const query: RunsListQuery = {
		sort_by: params.sort,
		page: params.page,
		size: params.pageSize,
	};

	let activeFilters = 0;

	if (params.status && params.status !== "all") {
		query.status = params.status;
		activeFilters++;
	}

	if (params.flowId) {
		query.pipeline_id = params.flowId;
		activeFilters++;
	}

	if (params.snapshotId) {
		query.source_snapshot_id = params.snapshotId;
		activeFilters++;
	}

	if (params.stackId) {
		query.stack_id = params.stackId;
		activeFilters++;
	}

	const trimmedSearch = params.search?.trim();
	if (trimmedSearch) {
		query.name = `contains:${trimmedSearch}`;
		activeFilters++;
	}

	if (params.range !== "all") {
		const cutoff = new Date(Date.now() - RANGE_TO_MS[params.range]);
		query.created = `gte:${cutoff.toISOString()}`;
		activeFilters++;
	}

	if (activeFilters >= 2) {
		query.logical_operator = "and";
	}

	return query;
}
