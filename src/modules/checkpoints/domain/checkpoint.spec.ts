import { describe, expect, it } from "vitest";
import type { components } from "@/shared/api/openapi";
import {
	checkpointFromApiToDomain,
	checkpointEntryFromApiToDomain,
} from "./checkpoint";

type ArtifactSaveType = components["schemas"]["ArtifactSaveType"];
type StepRunInputArtifactType =
	components["schemas"]["StepRunInputArtifactType"];

function makeArtifactBody(
	overrides: {
		artifactName?: string;
		saveType?: ArtifactSaveType;
	} = {}
): Record<string, unknown> {
	const body: Record<string, unknown> = {
		created: "2024-06-01T10:00:00Z",
		updated: "2024-06-01T10:00:00Z",
		project_id: "project-1",
		version: "1",
		uri: "s3://bucket/path",
		type: "DataArtifact",
		materializer: { module: "builtins", type: "internal" },
		data_type: { module: "builtins", attribute: "str", type: "builtin" },
		artifact: {
			id: "artifact-id-1",
			name: overrides.artifactName ?? "plain-artifact",
		},
	};

	if (overrides.saveType !== undefined) {
		body.save_type = overrides.saveType;
	}

	return body;
}

function makeInputArtifact(
	overrides: {
		id?: string;
		artifactName?: string;
		inputType?: StepRunInputArtifactType;
		saveType?: ArtifactSaveType;
	} = {}
): components["schemas"]["StepRunInputResponse"] {
	const result: Record<string, unknown> = {
		id: overrides.id ?? "input-id-1",
		body: makeArtifactBody({
			artifactName: overrides.artifactName,
			saveType: overrides.saveType,
		}),
	};

	if (overrides.inputType !== undefined) {
		result.input_type = overrides.inputType;
	}

	return result as unknown as components["schemas"]["StepRunInputResponse"];
}

function makeOutputArtifact(
	overrides: {
		id?: string;
		artifactName?: string;
		saveType?: ArtifactSaveType;
	} = {}
): components["schemas"]["ArtifactVersionResponse"] {
	return {
		id: overrides.id ?? "output-id-1",
		body: makeArtifactBody({
			artifactName: overrides.artifactName,
			saveType: overrides.saveType,
		}),
	} as unknown as components["schemas"]["ArtifactVersionResponse"];
}

function makeCheckpoint(
	overrides: {
		inputs?: Record<string, unknown>;
		outputs?: Record<string, unknown>;
	} = {}
): components["schemas"]["StepRunResponse"] {
	return {
		id: "checkpoint-id-1",
		name: "checkpoint-name",
		body: {
			status: "completed",
			start_time: "2024-06-01T10:00:00Z",
			end_time: "2024-06-01T10:00:05Z",
		},
		resources: {
			inputs: overrides.inputs,
			outputs: overrides.outputs,
		},
	} as unknown as components["schemas"]["StepRunResponse"];
}

describe("checkpointFromApiToDomain", () => {
	it("filters input artifacts using input_type semantics", () => {
		const checkpoint = makeCheckpoint({
			inputs: {
				stepOutput: [
					makeInputArtifact({
						id: "step-output-id",
						inputType: "step_output",
						artifactName: "upstream-result",
					}),
				],
				manual: [
					makeInputArtifact({
						id: "manual-id",
						inputType: "manual",
						artifactName: "manual-reference",
					}),
				],
				external: [
					makeInputArtifact({
						id: "external-id",
						inputType: "external",
						artifactName: "ordinary-name",
					}),
				],
				lazy: [
					makeInputArtifact({
						id: "lazy-id",
						inputType: "lazy",
						artifactName: "lazy-name",
					}),
				],
			},
		});

		expect(checkpointFromApiToDomain(checkpoint).inputs).toEqual([
			{ id: "step-output-id", name: "stepOutput" },
			{ id: "manual-id", name: "manual" },
		]);
	});

	it("filters output artifacts using save_type semantics", () => {
		const checkpoint = makeCheckpoint({
			outputs: {
				stepOutput: [
					makeOutputArtifact({
						id: "step-output-id",
						saveType: "step_output",
						artifactName: "output-result",
					}),
				],
				manual: [
					makeOutputArtifact({
						id: "manual-id",
						saveType: "manual",
						artifactName: "manual-result",
					}),
				],
				external: [
					makeOutputArtifact({
						id: "external-id",
						saveType: "external",
						artifactName: "ordinary-name",
					}),
				],
				preexisting: [
					makeOutputArtifact({
						id: "preexisting-id",
						saveType: "preexisting",
						artifactName: "preexisting-name",
					}),
				],
			},
		});

		expect(checkpointFromApiToDomain(checkpoint).outputs).toEqual([
			{ id: "step-output-id", name: "stepOutput" },
			{ id: "manual-id", name: "manual" },
		]);
	});

	it("keeps memory artifacts out of generic checkpoint chips", () => {
		const checkpoint = makeCheckpoint({
			inputs: {
				memoryInput: [
					makeInputArtifact({
						id: "memory-input-id",
						inputType: "manual",
						artifactName: "kitaru_mem:flow:repo_memory_demo:summaries/latest",
					}),
				],
			},
			outputs: {
				memoryOutput: [
					makeOutputArtifact({
						id: "memory-output-id",
						saveType: "manual",
						artifactName: "kitaru_mem:namespace:repo_docs:sessions/topic_count",
					}),
				],
			},
		});

		const mapped = checkpointFromApiToDomain(checkpoint);
		expect(mapped.inputs).toEqual([]);
		expect(mapped.outputs).toEqual([]);
	});

	it("treats external_ as a fallback heuristic, not the primary rule", () => {
		const checkpoint = makeCheckpoint({
			inputs: {
				manualNamedExternal: [
					makeInputArtifact({
						id: "manual-visible-id",
						inputType: "manual",
						saveType: "manual",
						artifactName: "external_report",
					}),
				],
				fallbackHidden: [
					makeInputArtifact({
						id: "fallback-hidden-id",
						saveType: "manual",
						artifactName: "external_fallback",
					}),
				],
			},
			outputs: {
				manualNamedExternal: [
					makeOutputArtifact({
						id: "manual-output-id",
						saveType: "manual",
						artifactName: "external_summary",
					}),
				],
				fallbackHidden: [
					makeOutputArtifact({
						id: "fallback-output-hidden-id",
						artifactName: "external_blob",
					}),
				],
			},
		});

		const mapped = checkpointFromApiToDomain(checkpoint);

		expect(mapped.inputs).toEqual([
			{ id: "manual-visible-id", name: "manualNamedExternal" },
		]);
		expect(mapped.outputs).toEqual([
			{ id: "manual-output-id", name: "manualNamedExternal" },
		]);
	});

	it("uses visible indexes after filtering when naming artifact chips", () => {
		const singleVisibleCheckpoint = makeCheckpoint({
			outputs: {
				result: [
					makeOutputArtifact({
						id: "hidden-memory-id",
						saveType: "manual",
						artifactName: "kitaru_mem:namespace:repo_docs:sessions/topic_count",
					}),
					makeOutputArtifact({
						id: "visible-output-id",
						saveType: "step_output",
						artifactName: "visible-output",
					}),
				],
			},
		});

		expect(checkpointFromApiToDomain(singleVisibleCheckpoint).outputs).toEqual([
			{ id: "visible-output-id", name: "result" },
		]);

		const multiVisibleCheckpoint = makeCheckpoint({
			outputs: {
				result: [
					makeOutputArtifact({
						id: "hidden-external-id",
						saveType: "external",
						artifactName: "ordinary-hidden-name",
					}),
					makeOutputArtifact({
						id: "visible-output-id-1",
						saveType: "step_output",
						artifactName: "visible-one",
					}),
					makeOutputArtifact({
						id: "visible-output-id-2",
						saveType: "manual",
						artifactName: "visible-two",
					}),
				],
			},
		});

		expect(checkpointFromApiToDomain(multiVisibleCheckpoint).outputs).toEqual([
			{ id: "visible-output-id-1", name: "result[0]" },
			{ id: "visible-output-id-2", name: "result[1]" },
		]);
	});

	it("ignores malformed input and output entries safely", () => {
		const checkpoint = makeCheckpoint({
			inputs: {
				notAnArray: "oops",
				malformed: [
					{ id: "missing-name", body: { artifact: {} } },
					{ body: { artifact: { name: "missing-id" } } },
				],
				good: [
					makeInputArtifact({
						id: "good-input-id",
						inputType: "step_output",
						artifactName: "good-input",
					}),
				],
			},
			outputs: {
				bad: [{ id: "missing-body" }],
				good: [
					makeOutputArtifact({
						id: "good-output-id",
						saveType: "step_output",
						artifactName: "good-output",
					}),
				],
			},
		});

		expect(() => checkpointFromApiToDomain(checkpoint)).not.toThrow();
		expect(checkpointFromApiToDomain(checkpoint).inputs).toEqual([
			{ id: "good-input-id", name: "good" },
		]);
		expect(checkpointFromApiToDomain(checkpoint).outputs).toEqual([
			{ id: "good-output-id", name: "good" },
		]);
	});

	it("maps StepRunResponse body.type = 'memory_call' to Checkpoint.type", () => {
		const checkpoint = {
			id: "checkpoint-id-memory",
			name: "remember_user_pref",
			body: {
				status: "completed",
				type: "memory_call",
			},
			resources: { inputs: {}, outputs: {} },
		} as unknown as components["schemas"]["StepRunResponse"];

		expect(checkpointFromApiToDomain(checkpoint).type).toBe("memory_call");
	});
});

describe("checkpointEntryFromApiToDomain", () => {
	it("maps DAG node metadata.type = 'memory_call' to CheckpointEntry.type", () => {
		const node = {
			id: "node-memory-1",
			node_id: "node-memory-1",
			name: "remember_user_pref",
			type: "step",
			metadata: {
				status: "completed",
				type: "memory_call",
			},
		} as unknown as components["schemas"]["Node"];

		expect(checkpointEntryFromApiToDomain(node).type).toBe("memory_call");
	});
});
