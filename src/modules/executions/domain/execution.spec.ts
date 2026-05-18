import { describe, expect, it } from "vitest";
import type { components } from "@/shared/api/openapi";
import { executionFromApiToDomain } from "./execution";

type PipelineRunResponse = components["schemas"]["PipelineRunResponse"];
type StackResponse = components["schemas"]["StackResponse"];
type PipelineBuildResponse = components["schemas"]["PipelineBuildResponse"];

function mkRun(
	overrides: Partial<PipelineRunResponse["resources"]> = {}
): PipelineRunResponse {
	return {
		id: "run-1",
		name: "run-name",
		body: {
			created: "2026-04-17T00:00:00Z",
			updated: "2026-04-17T00:00:00Z",
			status: "running",
			index: 1,
			in_progress: false,
			project_id: "00000000-0000-0000-0000-000000000000",
		},
		resources: {
			project_id: "00000000-0000-0000-0000-000000000000",
			tags: [],
			log_collection: null,
			...overrides,
		},
	} as PipelineRunResponse;
}

describe("executionFromApiToDomain", () => {
	it("extracts logSources from log_collection, translating ZenML sources to domain", () => {
		const run = mkRun({
			log_collection: [
				{
					id: "00000000-0000-0000-0000-000000000001",
					body: {
						source: "step",
						created: "2026-04-17T00:00:00Z",
						updated: "2026-04-17T00:00:00Z",
						project_id: "00000000-0000-0000-0000-000000000000",
					},
				},
				{
					id: "00000000-0000-0000-0000-000000000002",
					body: {
						source: "prepare_step",
						created: "2026-04-17T00:00:00Z",
						updated: "2026-04-17T00:00:00Z",
						project_id: "00000000-0000-0000-0000-000000000000",
					},
				},
			],
		});
		const exec = executionFromApiToDomain(run);
		expect(exec.logSources).toEqual(["checkpoint", "prepare_checkpoint"]);
	});

	it("defaults logSources to [] when log_collection is null/undefined", () => {
		expect(executionFromApiToDomain(mkRun()).logSources).toEqual([]);
		expect(
			executionFromApiToDomain(mkRun({ log_collection: undefined })).logSources
		).toEqual([]);
	});

	it("extracts stackId from resources.stack.id when present (un-hydrated stub)", () => {
		const run = mkRun({
			stack: { id: "stack-123" } as unknown as StackResponse,
		});
		expect(executionFromApiToDomain(run).stackId).toBe("stack-123");
	});

	it("extracts buildId from resources.build.id when present (un-hydrated stub)", () => {
		const run = mkRun({
			build: { id: "build-456" } as unknown as PipelineBuildResponse,
		});
		expect(executionFromApiToDomain(run).buildId).toBe("build-456");
	});

	it("leaves stackId and buildId undefined when resources.stack and resources.build are absent", () => {
		const exec = executionFromApiToDomain(mkRun());
		expect(exec.stackId).toBeUndefined();
		expect(exec.buildId).toBeUndefined();
	});
});

describe("flow + stack mapping", () => {
	it("extracts flowId/flowName from resources.pipeline", () => {
		const run = mkRun({
			pipeline: {
				id: "flow-1",
				name: "content_pipeline",
				body: {
					created: "2026-04-17T00:00:00Z",
					updated: "2026-04-17T00:00:00Z",
					project_id: "00000000-0000-0000-0000-000000000000",
				},
			} as components["schemas"]["PipelineResponse"],
		});
		const exec = executionFromApiToDomain(run);
		expect(exec.flowId).toBe("flow-1");
		expect(exec.flowName).toBe("content_pipeline");
	});

	it("extracts stackId/stackName from resources.stack", () => {
		const run = mkRun({
			stack: {
				id: "stack-1",
				name: "docker-local",
				body: {
					created: "2026-04-17T00:00:00Z",
					updated: "2026-04-17T00:00:00Z",
					project_id: "00000000-0000-0000-0000-000000000000",
				},
			} as components["schemas"]["StackResponse"],
		});
		const exec = executionFromApiToDomain(run);
		expect(exec.stackId).toBe("stack-1");
		expect(exec.stackName).toBe("docker-local");
	});

	it("leaves flow/stack fields undefined when resources are absent", () => {
		const exec = executionFromApiToDomain(mkRun());
		expect(exec.flowId).toBeUndefined();
		expect(exec.flowName).toBeUndefined();
		expect(exec.stackId).toBeUndefined();
		expect(exec.stackName).toBeUndefined();
	});
});
