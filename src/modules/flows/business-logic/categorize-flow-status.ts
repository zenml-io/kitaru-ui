import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import type { FlowStatusFilter } from "../domain/flow";

const FLOW_ACTIVE_STATUSES: Set<ExecutionStatus> = new Set([
	"initializing",
	"provisioning",
	"running",
	"retrying",
	"paused",
	"resuming",
	"stopping",
]);

const FLOW_FAILED_STATUSES: Set<ExecutionStatus> = new Set(["failed"]);

const FLOW_COMPLETED_STATUSES: Set<ExecutionStatus> = new Set([
	"completed",
	"cached",
	"skipped",
	"stopped",
	"retried",
]);

export function categorizeFlowStatus(
	status: ExecutionStatus | undefined
): FlowStatusFilter {
	if (!status) return "all";
	if (FLOW_ACTIVE_STATUSES.has(status)) return "running";
	if (FLOW_FAILED_STATUSES.has(status)) return "failed";
	if (FLOW_COMPLETED_STATUSES.has(status)) return "completed";
	return "all";
}
