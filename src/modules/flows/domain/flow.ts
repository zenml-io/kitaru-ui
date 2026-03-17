import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";

export const flowTabs = ["overview"] as const;
export type FlowTab = (typeof flowTabs)[number];

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
	latestExecStatus?: ExecutionStatus;
	latestexecutionId?: string;
	createdAt?: Date;
};

export type FlowStatusFilterOption = {
	label: string;
	value: FlowStatusFilter;
};

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
		latestexecutionId: flow.resources?.latest_run_id ?? undefined,
		createdAt: flow.body?.created ? new Date(flow.body.created) : undefined,
	};
}
