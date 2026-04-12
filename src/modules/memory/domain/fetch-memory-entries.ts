import { apiClient } from "@/shared/api/domain/api-client";
import { expectData } from "@/shared/api/utils/unwrap-api-result";
import {
	MEMORY_TAG_MARKER,
	mapArtifactVersionToMemoryEntry,
	type MemoryEntry,
} from "./memory";

const MAX_PAGE_SIZE = 10000;

type FetchMemoryEntriesOptions = {
	/** Extra tag filters ANDed with the always-present memory marker. */
	extraTags?: string[];
	/** Artifact name filter (exact or `startswith:` expression). */
	artifact?: string;
};

export async function fetchMemoryEntries({
	extraTags = [],
	artifact,
}: FetchMemoryEntriesOptions = {}): Promise<MemoryEntry[]> {
	const response = await apiClient.GET("/api/v1/artifact_versions", {
		params: {
			query: {
				tags: [MEMORY_TAG_MARKER, ...extraTags],
				artifact,
				logical_operator: "and",
				sort_by: "desc:version_number",
				hydrate: true,
				size: MAX_PAGE_SIZE,
			},
		},
	});

	return expectData(response)
		.items.map(mapArtifactVersionToMemoryEntry)
		.filter((e) => e !== null);
}
