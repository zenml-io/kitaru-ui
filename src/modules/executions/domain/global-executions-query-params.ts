import type { ExecutionStatus } from "./execution";

export const GLOBAL_EXECUTIONS_RANGE_VALUES = [
	"24h",
	"7d",
	"30d",
	"all",
] as const;

export type GlobalExecutionsRange =
	(typeof GLOBAL_EXECUTIONS_RANGE_VALUES)[number];

export const DEFAULT_GLOBAL_EXECUTIONS_PAGE_SIZE = 50;
export const DEFAULT_GLOBAL_EXECUTIONS_SORT = "desc:created";

/**
 * Single source of truth for the global executions view URL search defaults,
 * keyed by the route's search param names. Consumed by both the zod schema's
 * `.catch()` fallbacks and the `stripSearchParams` middleware so the two never
 * drift apart.
 */
export const GLOBAL_EXECUTIONS_SEARCH_DEFAULTS = {
	status: "all",
	range: "all",
	q: "",
	page: 1,
	sort: DEFAULT_GLOBAL_EXECUTIONS_SORT,
} as const;

export const GLOBAL_EXECUTIONS_ALLOWED_SORT_FIELDS = [
	"created",
	"status",
	"name",
] as const;

/**
 * Validated `/executions` URL search, as produced by the route's zod schema.
 * This is the input the global executions query is keyed on; the query layer
 * maps it to {@link GlobalExecutionsQueryParams} internally.
 */
export type GlobalExecutionsSearch = {
	status: ExecutionStatus | "all";
	flow?: string;
	version?: string;
	stack?: string;
	range: GlobalExecutionsRange;
	q: string;
	page: number;
	sort: string;
};

export type GlobalExecutionsQueryParams = {
	status?: ExecutionStatus | "all";
	flowId?: string;
	snapshotId?: string;
	stackId?: string;
	range: GlobalExecutionsRange;
	search?: string;
	sort: string;
	page: number;
	pageSize: number;
};

/**
 * Superset of every option `fetchExecutions` accepts. The global executions
 * view passes a fully-populated {@link GlobalExecutionsQueryParams} (which is
 * assignable to this); flow-scoped callers pass only the fields they need.
 */
export type ExecutionsQueryParams = {
	status?: ExecutionStatus | "all";
	flowId?: string;
	snapshotId?: string;
	stackId?: string;
	range?: GlobalExecutionsRange;
	search?: string;
	sort?: string;
	page?: number;
	pageSize?: number;
	hydrate?: boolean;
};
