import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import type { FlowStatusFilter } from "../domain/flow";

export const FLOW_ACTIVE_STATUSES = [
	"initializing",
	"provisioning",
	"running",
	"retrying",
	"paused",
	"resuming",
	"stopping",
] as const satisfies readonly ExecutionStatus[];

export const FLOW_FAILED_STATUSES = [
	"failed",
] as const satisfies readonly ExecutionStatus[];

export const FLOW_COMPLETED_STATUSES = [
	"completed",
	"cached",
	"skipped",
	"stopped",
	"retried",
] as const satisfies readonly ExecutionStatus[];

const FLOW_ACTIVE_STATUS_SET = new Set<ExecutionStatus>(FLOW_ACTIVE_STATUSES);
const FLOW_FAILED_STATUS_SET = new Set<ExecutionStatus>(FLOW_FAILED_STATUSES);
const FLOW_COMPLETED_STATUS_SET = new Set<ExecutionStatus>(
	FLOW_COMPLETED_STATUSES
);

export function categorizeFlowStatus(
	status: ExecutionStatus | undefined
): FlowStatusFilter {
	if (!status) return "all";
	if (FLOW_ACTIVE_STATUS_SET.has(status)) return "running";
	if (FLOW_FAILED_STATUS_SET.has(status)) return "failed";
	if (FLOW_COMPLETED_STATUS_SET.has(status)) return "completed";
	return "all";
}
