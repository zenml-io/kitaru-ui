import type { ArtifactStore } from "../domain/fetch-artifact-store";

export type ArtifactStoreState =
	| { kind: "local"; uri: string }
	| { kind: "remote-no-connector"; uri: string }
	| { kind: "remote-ok" }
	| { kind: "unknown" };

type ClassifyInput = {
	artifactStore?: ArtifactStore;
	uri?: string;
};

export function classifyArtifactStore({
	artifactStore,
	uri,
}: ClassifyInput): ArtifactStoreState {
	if (!artifactStore) return { kind: "unknown" };

	const flavorName = artifactStore.body?.flavor_name;
	const hasConnector = !!artifactStore.metadata?.connector;
	const resolvedUri = uri ?? "";

	if (flavorName === "local") return { kind: "local", uri: resolvedUri };
	if (!hasConnector) {
		return { kind: "remote-no-connector", uri: resolvedUri };
	}
	return { kind: "remote-ok" };
}
