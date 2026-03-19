import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import type { components } from "@/shared/api/openapi";

export type ArtifactEntry = {
	name: string;
	id: string;
};

export type CheckpointArtifacts = {
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

export async function fetchCheckpointArtifacts(
	checkpointId: string
): Promise<CheckpointArtifacts> {
	const response = await apiClient.GET("/api/v1/steps/{step_id}", {
		params: {
			path: { step_id: checkpointId },
			query: { hydrate: true },
		},
	});
	const checkpoint = expectData(response);

	return {
		inputs: extractArtifactEntries(checkpoint.resources?.inputs),
		outputs: extractArtifactEntries(checkpoint.resources?.outputs),
	};
}
