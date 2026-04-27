import { describe, expect, it } from "vitest";
import { classifyArtifactStore } from "./classify-artifact-store";
import type { ArtifactStore } from "../domain/fetch-artifact-store";

function makeStore(overrides: {
	flavorName?: string;
	hasConnector?: boolean;
}): ArtifactStore {
	const result: Record<string, unknown> = {
		id: "store-1",
		name: "store",
		body: {
			created: "2026-01-01T00:00:00Z",
			updated: "2026-01-01T00:00:00Z",
			type: "artifact_store",
			flavor_name: overrides.flavorName ?? "s3",
		},
		metadata: {
			configuration: {},
			connector: overrides.hasConnector ? { id: "c1" } : null,
		},
	};
	return result as unknown as ArtifactStore;
}

describe("classifyArtifactStore", () => {
	it("returns unknown when the store is missing", () => {
		expect(classifyArtifactStore({ uri: "/tmp/a" })).toEqual({
			kind: "unknown",
		});
	});

	it("identifies a local flavor as local", () => {
		const result = classifyArtifactStore({
			artifactStore: makeStore({ flavorName: "local" }),
			uri: "/tmp/a",
		});
		expect(result).toEqual({ kind: "local", uri: "/tmp/a" });
	});

	it("flags remote stores without a connector", () => {
		const result = classifyArtifactStore({
			artifactStore: makeStore({ flavorName: "s3", hasConnector: false }),
			uri: "s3://bucket/a",
		});
		expect(result).toEqual({
			kind: "remote-no-connector",
			uri: "s3://bucket/a",
		});
	});

	it("treats remote stores with a connector as ok", () => {
		const result = classifyArtifactStore({
			artifactStore: makeStore({ flavorName: "s3", hasConnector: true }),
			uri: "s3://bucket/a",
		});
		expect(result).toEqual({ kind: "remote-ok" });
	});

	it("preserves a missing uri as undefined for local stores", () => {
		const result = classifyArtifactStore({
			artifactStore: makeStore({ flavorName: "local" }),
		});
		expect(result).toEqual({ kind: "local", uri: undefined });
	});

	it("preserves a missing uri as undefined for remote stores without a connector", () => {
		const result = classifyArtifactStore({
			artifactStore: makeStore({ flavorName: "s3", hasConnector: false }),
		});
		expect(result).toEqual({ kind: "remote-no-connector", uri: undefined });
	});
});
