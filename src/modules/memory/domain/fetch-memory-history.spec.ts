import { beforeEach, describe, expect, it, vi } from "vitest";
import type { components } from "@/shared/api/openapi";
import { fetchMemoryArtifactVersions } from "./fetch-memory-artifact-versions";
import { fetchMemoryHistory } from "./fetch-memory-history";

vi.mock("./fetch-memory-artifact-versions", () => ({
	fetchMemoryArtifactVersions: vi.fn(),
}));

const mockedFetchMemoryArtifactVersions = vi.mocked(
	fetchMemoryArtifactVersions
);

function makeArtifactVersion(): components["schemas"]["ArtifactVersionResponse"] {
	return {
		id: "artifact-version-id-1",
		body: {
			created: "2024-06-01T10:00:00Z",
			updated: "2024-06-01T10:00:00Z",
			project_id: "project-1",
			version: "1",
			uri: "s3://bucket/path",
			type: "DataArtifact",
			materializer: { module: "builtins", type: "internal" },
			data_type: { module: "builtins", attribute: "dict", type: "builtin" },
			save_type: "step_output",
			artifact: {
				id: "artifact-id-1",
				name: "kitaru_mem:flow:coding_agent:counter",
			},
		},
		metadata: {
			run_metadata: {
				kitaru_memory_scope_type: "flow",
			},
		},
	} as unknown as components["schemas"]["ArtifactVersionResponse"];
}

describe("fetchMemoryHistory", () => {
	beforeEach(() => {
		mockedFetchMemoryArtifactVersions.mockReset();
	});

	it("filters history requests by scope type as well as scope name", async () => {
		mockedFetchMemoryArtifactVersions.mockResolvedValue([
			makeArtifactVersion(),
		]);

		await fetchMemoryHistory(
			{ scope: "coding_agent", scopeType: "flow" },
			"counter"
		);

		expect(mockedFetchMemoryArtifactVersions).toHaveBeenCalledWith({
			artifact: "kitaru_mem:flow:coding_agent:counter",
			tags: ["kitaru:memory", "kitaru:memory:scope_type:flow"],
			logical_operator: "and",
			sort_by: "desc:version_number",
		});
	});
});
