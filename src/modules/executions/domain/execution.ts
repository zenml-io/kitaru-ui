import type { components } from "@/shared/api/openapi";
import { type User, userFromApiToDomain } from "@/modules/users/domain/users";
import { parseBackendTimestamp } from "@/shared/utils/time";
export type ExecutionStatus = components["schemas"]["ExecutionStatus"];

export const executionStatusValues: ExecutionStatus[] = [
	"initializing",
	"provisioning",
	"running",
	"failed",
	"completed",
	"cached",
	"skipped",
	"retrying",
	"retried",
	"paused",
	"resuming",
	"stopped",
	"stopping",
] as const;

export const executionStatusFilterValues = [
	"all",
	"running",
	"failed",
	"completed",
] as const;

export type ExecutionStatusFilter =
	(typeof executionStatusFilterValues)[number];

export type Execution = {
	id: string;
	name: string;
	status?: ExecutionStatus;
	index: number;
	user?: User;
	createdAt?: Date;
	startTime?: Date;
	endTime?: Date;
	activeWaitConditionEntry?: {
		id?: string;
		name?: string;
	};
};

export function executionFromApiToDomain(
	run: components["schemas"]["PipelineRunResponse"]
): Execution {
	if (!run.body) {
		throw new Error("Execution body is required");
	}

	return {
		id: run.id,
		name: run.name,
		status: run.body.status,
		index: run.body.index,
		user: run?.resources?.user
			? userFromApiToDomain(run.resources.user)
			: undefined,
		createdAt: parseBackendTimestamp(run.body.created),
		startTime: run.metadata?.start_time
			? parseBackendTimestamp(run.metadata.start_time)
			: undefined,
		endTime: run.metadata?.end_time
			? parseBackendTimestamp(run.metadata.end_time)
			: undefined,
		activeWaitConditionEntry:
			run.resources?.active_wait_condition?.id ||
			run.resources?.active_wait_condition?.name
				? {
						id: run.resources?.active_wait_condition?.id,
						name: run.resources?.active_wait_condition?.name,
					}
				: undefined,
	};
}
