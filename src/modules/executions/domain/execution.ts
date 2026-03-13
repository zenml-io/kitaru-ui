import type { components } from "@/shared/api/openapi";

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
	status: ExecutionStatus | undefined;
	index?: number;
	authorName?: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export function executionFromApiToDomain(
	run: components["schemas"]["PipelineRunResponse"]
): Execution {
	return {
		id: run.id,
		name: run.name,
		status: run.body?.status ?? undefined,
		index: run.body?.index ?? undefined,
		authorName: run?.resources?.user?.body?.full_name ?? undefined,
		createdAt: run.body?.created ? new Date(run.body.created) : undefined,
		updatedAt: run.body?.updated ? new Date(run.body.updated) : undefined,
	};
}
