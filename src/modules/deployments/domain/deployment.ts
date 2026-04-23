import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { parseBackendTimestamp } from "@/shared/utils/time";

export const KITARU_SNAPSHOT_NAME = /^kitaru::(.+)::v(\d+)$/;

const KITARU_DEPLOYMENT_MARKER_TAG = "kitaru:deployment";
const KITARU_DEPLOYMENT_TAG = /^kitaru:deployment:tag:(.+):(exclusive|shared)$/;

export type TagKind = "default" | "exclusive" | "general";

export type DeploymentTag = {
	id: string;
	name: string;
	kind: TagKind;
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
	stackId?: string;
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
): DeploymentTag | null {
	if (tag.name === KITARU_DEPLOYMENT_MARKER_TAG) return null;
	const match = tag.name.match(KITARU_DEPLOYMENT_TAG);
	if (!match) return null;
	const [, userFacingName, mode] = match;
	const kind: TagKind =
		userFacingName === "default"
			? "default"
			: mode === "exclusive"
				? "exclusive"
				: "general";
	return {
		id: tag.id,
		name: userFacingName,
		kind,
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
		tags: (snapshot.resources?.tags ?? [])
			.map(tagFromApiToDomain)
			.filter((t): t is DeploymentTag => t !== null),
		createdAt: snapshot.body?.created
			? parseBackendTimestamp(snapshot.body.created)
			: undefined,
		updatedAt: snapshot.body?.updated
			? parseBackendTimestamp(snapshot.body.updated)
			: undefined,
		stackId: snapshot.resources?.stack?.id,
		stackName: snapshot.resources?.stack?.name,
		inputSchema: snapshot.metadata?.config_schema ?? undefined,
		latestRunId: snapshot.resources?.latest_run_id ?? undefined,
		latestRunStatus: snapshot.resources?.latest_run_status ?? undefined,
		runnable: snapshot.body?.runnable ?? false,
		deployable: snapshot.body?.deployable ?? false,
	};
}
