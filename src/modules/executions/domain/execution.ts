import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/execution/domain/execution";

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
};

export function executionFromApiToDomain(
	run: components["schemas"]["PipelineRunResponse"]
): Execution {
	return {
		id: run.id,
		name: run.name,
		status: run.body?.status ?? undefined,
	};
}
