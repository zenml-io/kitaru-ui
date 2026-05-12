import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { parseBackendTimestamp } from "@/shared/utils/time";

export const flowTabs = ["executions", "invoke"] as const;
export type FlowTab = (typeof flowTabs)[number];

export const flowTabLabels: Record<FlowTab, string> = {
	invoke: "Invoke",
	executions: "Executions",
};

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

export function flowFromApiToDomain(
	flow: components["schemas"]["PipelineResponse"]
): Flow {
	return {
		id: flow.id,
		name: flow.name,
		latestExecStatus: flow.resources?.latest_run_status ?? undefined,
		latestexecutionId: flow.resources?.latest_run_id ?? undefined,
		createdAt: flow.body?.created
			? parseBackendTimestamp(flow.body.created)
			: undefined,
	};
}
