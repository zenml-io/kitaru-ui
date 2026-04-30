import type { ArtifactStoreState } from "../domain/artifact-store-state";
import type { ArtifactStore } from "../domain/fetch-artifact-store";

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

	if (flavorName === "local") return { kind: "local", uri };
	if (!hasConnector) return { kind: "remote-no-connector", uri };
	return { kind: "remote-ok" };
}
