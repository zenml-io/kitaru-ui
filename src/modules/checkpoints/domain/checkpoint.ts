import type { components } from "@/shared/api/openapi";

export type CheckpointStatus = components["schemas"]["ExecutionStatus"];

export type Checkpoint = {
	id: string;
	name: string;
	status: CheckpointStatus;
	startTime?: Date;
	endTime?: Date;
};

export function checkpointFromApiToDomain(
	step: components["schemas"]["StepRunResponse"]
): Checkpoint {
	if (!step.body) {
		throw new Error("Checkpoint body is required");
	}

	return {
		id: step.id,
		name: step.name,
		status: step.body.status,
		startTime: step.body.start_time
			? new Date(step.body.start_time)
			: undefined,
		endTime: step.body.end_time ? new Date(step.body.end_time) : undefined,
	};
}
