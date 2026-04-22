import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { parseBackendTimestamp } from "@/shared/utils/time";

export const KITARU_SNAPSHOT_NAME = /^kitaru::(.+)::v(\d+)$/;

export type DeploymentTag = {
	id: string;
	name: string;
	exclusive: boolean;
	color?: components["schemas"]["ColorVariants"];
};

export type Deployment = {
	id: string;
	flowId: string;
	flowName: string;
	versionNumber: number;
	tags: DeploymentTag[];
	createdAt?: Date;
	updatedAt?: Date;
	stackName?: string;
	inputSchema?: Record<string, unknown>;
	latestRunId?: string;
	latestRunStatus?: ExecutionStatus;
	runnable: boolean;
	deployable: boolean;
};

export class NotAKitaruDeploymentError extends Error {
	constructor(snapshotId: string) {
		super(`Snapshot ${snapshotId} is not a Kitaru deployment`);
		this.name = "NotAKitaruDeploymentError";
	}
}

function tagFromApiToDomain(
	tag: components["schemas"]["TagResponse"]
): DeploymentTag {
	return {
		id: tag.id,
		name: tag.name,
		exclusive: tag.body?.exclusive ?? false,
		color: tag.body?.color,
	};
}

export function deploymentFromApiToDomain(
	snapshot: components["schemas"]["PipelineSnapshotResponse"]
): Deployment | null {
	const match = snapshot.name?.match(KITARU_SNAPSHOT_NAME);
	if (!match) return null;

	const pipeline = snapshot.resources?.pipeline;
	if (!pipeline) return null;

	const versionNumber = Number.parseInt(match[2], 10);

	return {
		id: snapshot.id,
		flowId: pipeline.id,
		flowName: pipeline.name,
		versionNumber,
		tags: (snapshot.resources?.tags ?? []).map(tagFromApiToDomain),
		createdAt: snapshot.body?.created
			? parseBackendTimestamp(snapshot.body.created)
			: undefined,
		updatedAt: snapshot.body?.updated
			? parseBackendTimestamp(snapshot.body.updated)
			: undefined,
		stackName: snapshot.resources?.stack?.name,
		inputSchema: snapshot.metadata?.config_schema ?? undefined,
		latestRunId: snapshot.resources?.latest_run_id ?? undefined,
		latestRunStatus: snapshot.resources?.latest_run_status ?? undefined,
		runnable: snapshot.body?.runnable ?? false,
		deployable: snapshot.body?.deployable ?? false,
	};
}
