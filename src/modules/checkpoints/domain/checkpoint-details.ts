import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { components } from "@/shared/api/openapi";
import type { ExecutionStatus } from "@/modules/executions/domain/execution";

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
	costUsd: number;
	inputs: ArtifactEntry[];
	outputs: ArtifactEntry[];
};

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

export async function fetchCheckpointDetails(
	checkpointId: string
): Promise<Checkpoint> {
	const response = await apiClient.GET("/api/v1/steps/{step_id}", {
		params: {
			path: { step_id: checkpointId },
			query: { hydrate: true },
		},
	});
	const checkpoint = expectData(response);

	console.log(checkpoint);
	return {
		id: checkpoint.id,
		name: checkpoint.name,
		status: checkpoint.body?.status || undefined,
		inputs: extractArtifactEntries(checkpoint.resources?.inputs),
		outputs: extractArtifactEntries(checkpoint.resources?.outputs),
		startTime: checkpoint.body?.start_time
			? new Date(checkpoint.body.start_time)
			: undefined,
		endTime: checkpoint.body?.end_time
			? new Date(checkpoint.body.end_time)
			: undefined,
		durationMs:
			checkpoint.body?.end_time && checkpoint.body?.start_time
				? new Date(checkpoint.body.end_time).getTime() -
					new Date(checkpoint.body.start_time).getTime()
				: undefined,
		type: checkpoint.body?.type ?? undefined,
		// @ts-expect-error - TODO: fix this
		costUsd:
			checkpoint.metadata?.run_metadata?.llm_usage?.cost_usd ?? undefined,
	};
}
