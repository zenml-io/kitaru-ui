import { describe, expect, it } from "vitest";
import type { components } from "@/shared/api/openapi";
import {
	buildLocalDeployment,
	deploymentFromApiToDomain,
	formatVersion,
	KITARU_SNAPSHOT_NAME,
	LOCAL_VERSION_ID,
	NotAKitaruDeploymentError,
	parseVersionFromSnapshotName,
} from "./deployment";

type SnapshotResponse = components["schemas"]["PipelineSnapshotResponse"];

function mkSnapshot(
	overrides: Partial<SnapshotResponse> = {}
): SnapshotResponse {
	return {
		id: "snap-1",
		name: "kitaru::research_agent::v3",
		body: {
			created: "2026-04-22T10:00:00Z",
			updated: "2026-04-22T10:00:00Z",
			project_id: "00000000-0000-0000-0000-000000000000",
			runnable: true,
			deployable: true,
			is_dynamic: false,
		},
		metadata: {
			run_name_template: "",
			pipeline_configuration: {},
			client_version: null,
			server_version: null,
		},
		resources: {
			pipeline: {
				id: "flow-1",
				name: "research_agent",
				body: {
					created: "2026-04-22T10:00:00Z",
					updated: "2026-04-22T10:00:00Z",
					project_id: "00000000-0000-0000-0000-000000000000",
				},
			},
			tags: [],
		},
		...overrides,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any as SnapshotResponse;
}

describe("KITARU_SNAPSHOT_NAME regex", () => {
	it("matches kitaru::<flow>::v<N>", () => {
		const match = "kitaru::research_agent::v3".match(KITARU_SNAPSHOT_NAME);
		expect(match).not.toBeNull();
		expect(match?.[1]).toBe("research_agent");
		expect(match?.[2]).toBe("3");
	});

	it("rejects vanilla ZenML snapshot names", () => {
		expect("some-pipeline-run-42".match(KITARU_SNAPSHOT_NAME)).toBeNull();
		expect("kitaru::research_agent".match(KITARU_SNAPSHOT_NAME)).toBeNull();
		expect("research_agent::v1".match(KITARU_SNAPSHOT_NAME)).toBeNull();
	});
});

describe("parseVersionFromSnapshotName", () => {
	it("returns the version digits as a number for kitaru snapshot names", () => {
		expect(parseVersionFromSnapshotName("kitaru::research_agent::v3")).toBe(3);
		expect(parseVersionFromSnapshotName("kitaru::any_flow_name::v42")).toBe(42);
	});

	it("returns null when the name doesn't match the kitaru pattern", () => {
		expect(parseVersionFromSnapshotName("vanilla-snapshot")).toBeNull();
		expect(parseVersionFromSnapshotName("kitaru::research_agent")).toBeNull();
	});

	it("returns null for empty / null / undefined input", () => {
		expect(parseVersionFromSnapshotName("")).toBeNull();
		expect(parseVersionFromSnapshotName(null)).toBeNull();
		expect(parseVersionFromSnapshotName(undefined)).toBeNull();
	});
});

describe("deploymentFromApiToDomain", () => {
	it("returns null for a non-Kitaru snapshot name", () => {
		const snapshot = mkSnapshot({ name: "vanilla-snapshot" });
		expect(deploymentFromApiToDomain(snapshot)).toBeNull();
	});

	it("returns null when snapshot.name is missing", () => {
		const snapshot = mkSnapshot({ name: null });
		expect(deploymentFromApiToDomain(snapshot)).toBeNull();
	});

	it("maps a matching snapshot to a Deployment", () => {
		const snapshot = mkSnapshot();
		const result = deploymentFromApiToDomain(snapshot);
		expect(result).not.toBeNull();
		expect(result?.id).toBe("snap-1");
		expect(result?.flowId).toBe("flow-1");
		expect(result?.flowName).toBe("research_agent");
		expect(result?.version).toBe(3);
		expect(result?.runnable).toBe(true);
		expect(result?.deployable).toBe(true);
		expect(result?.createdAt).toEqual(new Date("2026-04-22T10:00:00Z"));
	});

	it("decodes kitaru tag names and drops marker + non-kitaru tags", () => {
		const snapshot = mkSnapshot({
			resources: {
				pipeline: {
					id: "flow-1",
					name: "research_agent",
					body: {
						created: "2026-04-22T10:00:00Z",
						updated: "2026-04-22T10:00:00Z",
						project_id: "00000000-0000-0000-0000-000000000000",
					},
				},
				tags: [
					{
						id: "tag-marker",
						name: "kitaru:deployment",
						body: {
							created: "2026-04-22T10:00:00Z",
							updated: "2026-04-22T10:00:00Z",
							exclusive: false,
						},
					},
					{
						id: "tag-default",
						name: "kitaru:deployment:tag:default:exclusive",
						body: {
							created: "2026-04-22T10:00:00Z",
							updated: "2026-04-22T10:00:00Z",
							exclusive: true,
						},
					},
					{
						id: "tag-canary",
						name: "kitaru:deployment:tag:canary:exclusive",
						body: {
							created: "2026-04-22T10:00:00Z",
							updated: "2026-04-22T10:00:00Z",
							exclusive: true,
						},
					},
					{
						id: "tag-beta",
						name: "kitaru:deployment:tag:beta:shared",
						body: {
							created: "2026-04-22T10:00:00Z",
							updated: "2026-04-22T10:00:00Z",
							exclusive: false,
						},
					},
					{
						id: "tag-foreign",
						name: "some-zenml-project-tag",
						body: {
							created: "2026-04-22T10:00:00Z",
							updated: "2026-04-22T10:00:00Z",
							exclusive: false,
						},
					},
				],
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any,
		});
		const result = deploymentFromApiToDomain(snapshot);
		expect(result?.tags).toEqual([
			{ id: "tag-default", name: "default", kind: "default", color: undefined },
			{ id: "tag-canary", name: "canary", kind: "exclusive", color: undefined },
			{ id: "tag-beta", name: "beta", kind: "general", color: undefined },
		]);
	});

	it("maps stackName, latestRun*, and inputSchema when hydrated", () => {
		const snapshot = mkSnapshot({
			metadata: {
				run_name_template: "",
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				pipeline_configuration: {} as any,
				client_version: null,
				server_version: null,
				config_schema: {
					type: "object",
					properties: { topic: { type: "string" } },
				},
			},
			resources: {
				pipeline: {
					id: "flow-1",
					name: "research_agent",
					body: {
						created: "2026-04-22T10:00:00Z",
						updated: "2026-04-22T10:00:00Z",
						project_id: "00000000-0000-0000-0000-000000000000",
					},
				},
				tags: [],
				stack: {
					id: "stack-1",
					name: "prod-stack",
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any,
				latest_run_id: "run-99",
				latest_run_status: "completed",
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any,
		});
		const result = deploymentFromApiToDomain(snapshot);
		expect(result?.stackId).toBe("stack-1");
		expect(result?.stackName).toBe("prod-stack");
		expect(result?.latestRunId).toBe("run-99");
		expect(result?.latestRunStatus).toBe("completed");
		expect(result?.inputSchema).toEqual({
			type: "object",
			properties: { topic: { type: "string" } },
		});
	});
});

describe("NotAKitaruDeploymentError", () => {
	it("carries the snapshot id and a distinctive name", () => {
		const err = new NotAKitaruDeploymentError("snap-xyz");
		expect(err.name).toBe("NotAKitaruDeploymentError");
		expect(err.message).toContain("snap-xyz");
	});
});

describe("buildLocalDeployment", () => {
	it("produces a deployment whose id and version are LOCAL_VERSION_ID", () => {
		const local = buildLocalDeployment("flow-1", "research_agent");
		expect(local.id).toBe(LOCAL_VERSION_ID);
		expect(local.version).toBe(LOCAL_VERSION_ID);
		expect(local.flowId).toBe("flow-1");
		expect(local.flowName).toBe("research_agent");
		expect(local.tags).toEqual([]);
		expect(local.runnable).toBe(false);
		expect(local.deployable).toBe(false);
	});
});

describe("formatVersion", () => {
	it("returns 'local' for the synthetic local version", () => {
		expect(formatVersion(LOCAL_VERSION_ID)).toBe("local");
	});

	it("prefixes numeric versions with 'v'", () => {
		expect(formatVersion(7)).toBe("v7");
	});
});
