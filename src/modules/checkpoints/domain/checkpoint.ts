import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";

export type Checkpoint = {
	id: string;
	name: string;
	durationMs: number;
	status: ExecutionStatus;
	startTime?: Date;
	type: components["schemas"]["StepType"];
	costUsd: number;
};

export function checkpointFromApiToDomain(
	node: components["schemas"]["Node"]
): Checkpoint {
	return {
		id: node.id ?? node.node_id,
		name: node.name,
		durationMs: (Number(node.metadata?.duration) || 0) * 1000,
		status: node.metadata?.status as ExecutionStatus,
		startTime: node.metadata?.start_time
			? new Date(node.metadata?.start_time as string)
			: undefined,
		type: node.metadata?.type as components["schemas"]["StepType"],
		// @ts-expect-error - TODO: fix this
		costUsd: node.metadata?.run_metadata?.llm_usage?.cost_usd ?? 0,
	};
}
