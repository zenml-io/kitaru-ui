import type { components } from "@/shared/api/openapi";
import { type User, userFromApiToDomain } from "@/modules/users/domain/users";
import { extractLogSources } from "@/modules/logs/domain/log-mapper";
import { parseBackendTimestamp } from "@/shared/utils/time";
import {
	type DeploymentVersion,
	LOCAL_VERSION_ID,
	parseVersionFromSnapshotName,
} from "@/modules/deployments/domain/deployment";
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
	"initializing",
	"provisioning",
	"running",
	"retrying",
	"paused",
	"resuming",
	"stopping",
	"stopped",
	"completed",
	"cached",
	"skipped",
	"retried",
	"failed",
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
		version: DeploymentVersion;
	};
	snapshot?: {
		id: string;
		runnable?: boolean;
	};
	flowId?: string;
	flowName?: string;
	stackId?: string;
	stackName?: string;
	buildId?: string;
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
		durationMs:
			run.metadata?.end_time && run.metadata?.start_time
				? parseBackendTimestamp(run.metadata.end_time).getTime() -
					parseBackendTimestamp(run.metadata.start_time).getTime()
				: undefined,
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
					version:
						parseVersionFromSnapshotName(run.resources.source_snapshot.name) ??
						LOCAL_VERSION_ID,
				}
			: undefined,
		snapshot: run.resources?.snapshot
			? {
					id: run.resources?.snapshot?.id,
					runnable: run.resources?.snapshot?.body?.runnable,
				}
			: undefined,
		flowId: run.resources?.pipeline?.id,
		flowName: run.resources?.pipeline?.name,
		stackId: run.resources?.stack?.id,
		stackName: run.resources?.stack?.name,
		buildId: run.resources?.build?.id,
	};
}
