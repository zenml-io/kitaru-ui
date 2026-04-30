import { VisualizationSkeleton } from "@/modules/checkpoints/ui/VisualizationSkeleton";
import { VisualizationErrorFallback } from "@/modules/executions/ui/VisualizationErrorFallback";
import { isFetchError } from "@/shared/api/domain/fetch-error";
import { useArtifactStoreState } from "../business-logic/use-artifact-store-state";
import {
	DepsMissingArtifactStoreFallback,
	LocalArtifactStoreFallback,
	NoConnectorArtifactStoreFallback,
} from "../ui/ArtifactStoreFallback";

type Props = {
	artifactVersionId: string;
	error?: Error;
};

export function ArtifactStoreFallbackContainer({
	artifactVersionId,
	error,
}: Props) {
	const { state, storeError, isPending } =
		useArtifactStoreState(artifactVersionId);

	if (isPending) return <VisualizationSkeleton />;

	if (state.kind === "local") {
		return <LocalArtifactStoreFallback uri={state.uri} />;
	}

	if (state.kind === "remote-no-connector") {
		return <NoConnectorArtifactStoreFallback uri={state.uri} />;
	}

	if (isFetchError(error) && error.status === 501) {
		return <DepsMissingArtifactStoreFallback />;
	}

	return <VisualizationErrorFallback error={storeError ?? error} />;
}
