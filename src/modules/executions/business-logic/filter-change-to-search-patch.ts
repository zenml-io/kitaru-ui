import type { ExecutionStatusFilter } from "../domain/execution";
import type { GlobalExecutionsRange } from "../domain/global-executions-query-params";

export type FilterChange = {
	status?: ExecutionStatusFilter;
	flowId?: string;
	snapshotId?: string;
	stackId?: string;
	range?: GlobalExecutionsRange;
	search?: string;
};

// Maps FilterChange (domain-shaped, partial) → URL-search patch.
// `"key" in change` keeps spread semantics: missing keys leave prev untouched,
// keys explicitly set to undefined clear the URL param.
const FILTER_TO_SEARCH_KEY = {
	status: "status",
	flowId: "flow",
	snapshotId: "version",
	stackId: "stack",
	range: "range",
	search: "q",
} as const;

export type SearchPatch = Partial<{
	status: FilterChange["status"];
	flow: FilterChange["flowId"];
	version: FilterChange["snapshotId"];
	stack: FilterChange["stackId"];
	range: FilterChange["range"];
	q: FilterChange["search"];
}>;

export function filterChangeToSearchPatch(change: FilterChange): SearchPatch {
	const patch: SearchPatch = {};
	for (const filterKey of Object.keys(FILTER_TO_SEARCH_KEY) as Array<
		keyof typeof FILTER_TO_SEARCH_KEY
	>) {
		if (filterKey in change) {
			const searchKey = FILTER_TO_SEARCH_KEY[filterKey];
			Object.assign(patch, { [searchKey]: change[filterKey] });
		}
	}
	return patch;
}
