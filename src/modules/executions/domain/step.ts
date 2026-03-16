import type { components } from "@/shared/api/openapi";

export type StepStatus = components["schemas"]["ExecutionStatus"];

export type Step = {
	id: string;
	name: string;
	status: StepStatus;
	startTime?: Date;
	endTime?: Date;
};

export function stepFromApiToDomain(
	step: components["schemas"]["StepRunResponse"]
): Step {
	if (!step.body) {
		throw new Error("Step body is required");
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
