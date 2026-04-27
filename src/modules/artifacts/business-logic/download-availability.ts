import type { ArtifactStoreState } from "../domain/artifact-store-state";

export function getDownloadUnavailableReason(
	state: ArtifactStoreState
): string | null {
	switch (state.kind) {
		case "local":
			return "Download unavailable — artifact is stored in a local artifact store.";
		case "remote-no-connector":
			return "Download unavailable — artifact store has no service connector configured.";
		case "remote-ok":
		case "unknown":
			return null;
	}
}
