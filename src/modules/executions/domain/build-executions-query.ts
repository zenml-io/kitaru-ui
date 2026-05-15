import type { operations } from "@/shared/api/openapi";
import { formatBackendTimestamp } from "@/shared/utils/time";
import type {
	ExecutionsQueryParams,
	GlobalExecutionsRange,
} from "./global-executions-query-params";

type ExecutionsListQueryAll = NonNullable<
	operations["list_runs_api_v1_runs_get"]["parameters"]["query"]
>;

export type ExecutionsListQuery = Pick<
	ExecutionsListQueryAll,
	| "sort_by"
	| "page"
	| "size"
	| "status"
	| "pipeline_id"
	| "pipeline_name"
	| "source_snapshot_id"
	| "stack_id"
	| "index"
	| "created"
	| "hydrate"
>;

const RANGE_TO_MS: Record<Exclude<GlobalExecutionsRange, "all">, number> = {
	"24h": 24 * 60 * 60 * 1000,
	"7d": 7 * 24 * 60 * 60 * 1000,
	"30d": 30 * 24 * 60 * 60 * 1000,
};

// Multiple filters combine with AND on the backend by default
// (see `BaseFilter.logical_operator` in zenml/models/v2/base/filter.py).
export function buildExecutionsQuery(
	params: ExecutionsQueryParams
): ExecutionsListQuery {
	return {
		sort_by: params.sort,
		page: params.page,
		size: params.pageSize,
		status: params.status === "all" ? undefined : params.status,
		pipeline_id: params.flowId,
		source_snapshot_id: params.snapshotId,
		stack_id: params.stackId,
		created: resolveCreatedFilter(params.range),
		hydrate: params.hydrate,
		...resolveSearchFilter(params.search),
	};
}

function resolveSearchFilter(
	raw: string | undefined
): Pick<ExecutionsListQuery, "index" | "pipeline_name"> {
	const trimmed = raw?.trim();
	if (!trimmed) return {};
	// `#42` is an exact index lookup; anything else (including bare digits)
	// is treated as a flow-name substring match.
	const indexMatch = trimmed.match(/^#(\d+)$/);
	if (indexMatch) return { index: Number.parseInt(indexMatch[1], 10) };
	return { pipeline_name: `contains:${trimmed}` };
}

function resolveCreatedFilter(
	range: GlobalExecutionsRange | undefined
): string | undefined {
	if (range === undefined || range === "all") return undefined;
	const cutoff = new Date(Date.now() - RANGE_TO_MS[range]);
	return `gte:${formatBackendTimestamp(cutoff)}`;
}
