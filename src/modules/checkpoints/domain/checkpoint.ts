import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";
import { parseBackendTimestamp } from "@/shared/utils/time";

export type ArtifactEntry = {
	name: string;
	id: string;
};

export type Checkpoint = {
	id: string;
	name: string;
	durationMs?: number;
	status?: ExecutionStatus;
	startTime?: Date;
	endTime?: Date;
	type?: components["schemas"]["StepType"];
	costUsd?: number;
	inputs: ArtifactEntry[];
	outputs: ArtifactEntry[];
};

export function checkpointFromApiToDomain(
	checkpoint: components["schemas"]["StepRunResponse"]
): Checkpoint {
	return {
		id: checkpoint.id,
		name: checkpoint.name,
		status: checkpoint.body?.status || undefined,
		inputs: extractArtifactEntries(checkpoint.resources?.inputs),
		outputs: extractArtifactEntries(checkpoint.resources?.outputs),
		startTime: checkpoint.body?.start_time
			? parseBackendTimestamp(checkpoint.body.start_time)
			: undefined,
		endTime: checkpoint.body?.end_time
			? parseBackendTimestamp(checkpoint.body.end_time)
			: undefined,
		durationMs:
			checkpoint.body?.end_time && checkpoint.body?.start_time
				? parseBackendTimestamp(checkpoint.body.end_time).getTime() -
					parseBackendTimestamp(checkpoint.body.start_time).getTime()
				: undefined,
		type: checkpoint.body?.type ?? undefined,
		costUsd:
			// @ts-expect-error - TODO: fix this
			checkpoint.metadata?.run_metadata?.llm_usage?.cost_usd ?? undefined,
	};
}

function extractArtifactEntries(
	record: Record<string, unknown> | undefined
): ArtifactEntry[] {
	if (!record) return [];
	return Object.entries(record).flatMap(([name, value]) => {
		const versions =
			value as components["schemas"]["ArtifactVersionResponse"][];
		if (!Array.isArray(versions)) return [];
		return versions.flatMap((v, index) => {
			if (!v.id) return [];
			const entryName = versions.length > 1 ? `${name}[${index}]` : name;
			return [{ name: entryName, id: v.id }];
		});
	});
}

export type CheckpointEntry = {
	id: string;
	name: string;
	durationMs?: number;
	status: ExecutionStatus;
	startTime?: Date;
	type?: components["schemas"]["StepType"];
};

export function checkpointEntryFromApiToDomain(
	node: components["schemas"]["Node"]
): CheckpointEntry {
	return {
		id: node.id ?? node.node_id,
		name: node.name,
		durationMs: node.metadata?.duration
			? (Number(node.metadata?.duration) || 0) * 1000
			: undefined,
		status: node.metadata?.status as ExecutionStatus,
		startTime: node.metadata?.start_time
			? parseBackendTimestamp(node.metadata?.start_time as string)
			: undefined,
		type: node.metadata?.type as components["schemas"]["StepType"],
	};
}
