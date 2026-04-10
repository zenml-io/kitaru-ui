import { describe, expect, it } from "vitest";
import type { components } from "@/shared/api/openapi";
import {
	buildMemoryArtifactName,
	parseMemoryArtifactName,
	isCompactionKey,
	mapArtifactVersionToMemoryEntry,
} from "./memory";

describe("parseMemoryArtifactName", () => {
	it("parses a valid typed artifact name", () => {
		expect(parseMemoryArtifactName("kitaru_mem:flow:my-flow:counter")).toEqual({
			scope: "my-flow",
			scopeType: "flow",
			key: "counter",
		});
	});

	it("handles keys containing colons", () => {
		expect(
			parseMemoryArtifactName("kitaru_mem:flow:my-flow:nested:key:value")
		).toEqual({
			scope: "my-flow",
			scopeType: "flow",
			key: "nested:key:value",
		});
	});

	it("falls back to legacy untyped artifact names", () => {
		expect(parseMemoryArtifactName("kitaru_mem:my-flow:counter")).toEqual({
			scope: "my-flow",
			scopeType: "unknown",
			key: "counter",
		});
	});

	it("returns null for wrong prefix", () => {
		expect(parseMemoryArtifactName("other_mem:scope:key")).toBeUndefined();
	});

	it("returns null for missing scope", () => {
		expect(parseMemoryArtifactName("kitaru_mem:flow::key")).toBeUndefined();
	});

	it("returns null for missing key", () => {
		expect(parseMemoryArtifactName("kitaru_mem:flow:scope:")).toBeUndefined();
	});

	it("returns null for missing scope and key", () => {
		expect(parseMemoryArtifactName("kitaru_mem:")).toBeUndefined();
	});

	it("returns null for empty string", () => {
		expect(parseMemoryArtifactName("")).toBeUndefined();
	});

	it("returns null for prefix only with no colon after scope", () => {
		expect(parseMemoryArtifactName("kitaru_mem:scopeonly")).toBeUndefined();
	});
});

describe("buildMemoryArtifactName", () => {
	it("builds a typed artifact name", () => {
		expect(
			buildMemoryArtifactName(
				{ scope: "my-flow", scopeType: "flow" },
				"counter"
			)
		).toBe("kitaru_mem:flow:my-flow:counter");
	});
});

describe("isCompactionKey", () => {
	it("returns true for compaction keys", () => {
		expect(isCompactionKey("_compaction/2024-01-01")).toBe(true);
	});

	it("returns false for normal keys", () => {
		expect(isCompactionKey("counter")).toBe(false);
	});

	it("returns false for keys containing compaction in the middle", () => {
		expect(isCompactionKey("my_compaction/key")).toBe(false);
	});
});

function makeArtifactVersion(
	overrides: {
		name?: string;
		version?: string;
		created?: string;
		scopeType?: string;
		deleted?: unknown;
		executionId?: string | null;
	} = {}
): components["schemas"]["ArtifactVersionResponse"] {
	// Minimal fixture — only fields the mapper actually reads.
	// Use unknown intermediate to avoid satisfying every optional OpenAPI field.
	return {
		id: "artifact-version-id-1",
		body: {
			created: overrides.created ?? "2024-06-01T10:00:00Z",
			updated: "2024-06-01T10:00:00Z",
			project_id: "project-1",
			version: overrides.version ?? "1",
			uri: "s3://bucket/path",
			type: "DataArtifact",
			materializer: { module: "builtins", type: "internal" },
			data_type: { module: "builtins", attribute: "dict", type: "builtin" },
			save_type: "step_output",
			artifact: {
				id: "artifact-id-1",
				name: overrides.name ?? "kitaru_mem:flow:my-flow:counter",
			},
		},
		metadata: {
			run_metadata: {
				...(overrides.scopeType !== undefined
					? { kitaru_memory_scope_type: overrides.scopeType }
					: { kitaru_memory_scope_type: "flow" }),
				...(overrides.deleted !== undefined
					? { kitaru_memory_deleted: overrides.deleted }
					: {}),
			},
		},
		resources: {
			tags: [{ id: "tag-1", name: "kitaru:memory" }],
			producer_pipeline_run_id: overrides.executionId ?? null,
		},
	} as unknown as components["schemas"]["ArtifactVersionResponse"];
}

describe("mapArtifactVersionToMemoryEntry", () => {
	it("maps a valid artifact version to a MemoryEntry", () => {
		const av = makeArtifactVersion({ executionId: "run-123" });
		const entry = mapArtifactVersionToMemoryEntry(av);

		expect(entry).toEqual({
			key: "counter",
			scope: "my-flow",
			version: "1",
			valueType: "dict",
			scopeType: "flow",
			createdAt: new Date("2024-06-01T10:00:00Z"),
			isDeleted: false,
			artifactId: "artifact-version-id-1",
		});
	});

	it("returns null when body is missing", () => {
		const av = {
			id: "id-1",
		} as components["schemas"]["ArtifactVersionResponse"];
		expect(mapArtifactVersionToMemoryEntry(av)).toBeNull();
	});

	it("returns null when artifact name is malformed", () => {
		const av = makeArtifactVersion({ name: "not-a-memory-artifact" });
		expect(mapArtifactVersionToMemoryEntry(av)).toBeNull();
	});

	it("defaults scopeType to unknown when metadata is missing", () => {
		const av = makeArtifactVersion({
			name: "kitaru_mem:legacy-flow:counter",
			scopeType: "bogus",
		});
		const entry = mapArtifactVersionToMemoryEntry(av);
		expect(entry?.scopeType).toBe("unknown");
	});

	it("prefers the scope type encoded in the typed artifact name", () => {
		const av = makeArtifactVersion({ scopeType: "namespace" });
		const entry = mapArtifactVersionToMemoryEntry(av);
		expect(entry?.scopeType).toBe("flow");
	});

	it("parses isDeleted from boolean true", () => {
		const av = makeArtifactVersion({ deleted: true });
		expect(mapArtifactVersionToMemoryEntry(av)?.isDeleted).toBe(true);
	});

	it("parses isDeleted from string 'true'", () => {
		const av = makeArtifactVersion({ deleted: "true" });
		expect(mapArtifactVersionToMemoryEntry(av)?.isDeleted).toBe(true);
	});

	it("defaults isDeleted to false when not present", () => {
		const av = makeArtifactVersion();
		expect(mapArtifactVersionToMemoryEntry(av)?.isDeleted).toBe(false);
	});

	it("falls back to module name when attribute is missing", () => {
		const av = makeArtifactVersion();
		// Override data_type to have no attribute
		av.body!.data_type = { module: "builtins.str", type: "builtin" };
		const entry = mapArtifactVersionToMemoryEntry(av);
		expect(entry?.valueType).toBe("str");
	});
});
