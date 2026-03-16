import type { components } from "@/shared/api/openapi";
import { type User, userFromApiToDomain } from "@/modules/root/domain/user";
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
		createdAt: new Date(run.body.created),
	};
}
