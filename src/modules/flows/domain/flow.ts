import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/execution/domain/execution";

export const flowStatusFilterValues = [
	"all",
	"running",
	"failed",
	"completed",
] as const;

export type FlowStatusFilter = (typeof flowStatusFilterValues)[number];

export type Flow = {
	id: string;
	name: string;
	latestExecStatus: ExecutionStatus | undefined;
	latestExecId: string | undefined;
};

export type FlowStatusFilterOption = {
	label: string;
	value: FlowStatusFilter;
};

// TODO: Add statuses from the API
export const flowStatusFilterOptions: FlowStatusFilterOption[] = [
	{ label: "All", value: "all" },
	{ label: "Running", value: "running" },
	{ label: "Failed", value: "failed" },
	{ label: "Completed", value: "completed" },
];

export function flowFromApiToDomain(
	flow: components["schemas"]["PipelineResponse"]
): Flow {
	return {
		id: flow.id,
		name: flow.name,
		latestExecStatus: flow.resources?.latest_run_status ?? undefined,
		latestExecId: flow.resources?.latest_run_id ?? undefined,
	};
}
