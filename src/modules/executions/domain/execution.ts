import type { components } from "@/shared/api/openapi";
import { type User, userFromApiToDomain } from "@/modules/users/domain/users";
import { extractLogSources } from "@/modules/logs/domain/log-mapper";
import { parseBackendTimestamp } from "@/shared/utils/time";
export type ExecutionStatus = components["schemas"]["ExecutionStatus"];
export type RunConfiguration = components["schemas"]["ReplayRunConfiguration"];

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
	durationMs?: number;
	logSources: string[];
	activeWaitConditionEntry?: {
		id?: string;
		name?: string;
	};
	sourceSnapshot?: {
		id: string;
	};
	snapshot?: {
		id: string;
		runnable?: boolean;
	};
};

function computeDurationMs(
	run: components["schemas"]["PipelineRunResponse"]
): number | undefined {
	const start =
		run.metadata?.start_time ?? (run.body ? run.body.created : undefined);
	const end =
		run.metadata?.end_time ?? (run.body ? run.body.updated : undefined);
	if (!start || !end || start === end) return undefined;
	const ms =
		parseBackendTimestamp(end).getTime() -
		parseBackendTimestamp(start).getTime();
	return ms > 0 ? ms : undefined;
}

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
		startTime: parseBackendTimestamp(
			run.metadata?.start_time ?? run.body.created
		),
		endTime:
			run.metadata?.end_time != null
				? parseBackendTimestamp(run.metadata.end_time)
				: run.body.updated != null && run.body.updated !== run.body.created
					? parseBackendTimestamp(run.body.updated)
					: undefined,
		durationMs: computeDurationMs(run),
		logSources: extractLogSources(run.resources?.log_collection),
		activeWaitConditionEntry:
			run.resources?.active_wait_condition?.id ||
			run.resources?.active_wait_condition?.name
				? {
						id: run.resources?.active_wait_condition?.id,
						name: run.resources?.active_wait_condition?.name,
					}
				: undefined,
		sourceSnapshot: run.resources?.source_snapshot
			? {
					id: run.resources.source_snapshot.id,
				}
			: undefined,
		snapshot: run.resources?.snapshot
			? {
					id: run.resources?.snapshot?.id,
					runnable: run.resources?.snapshot?.body?.runnable,
				}
			: undefined,
	};
}
