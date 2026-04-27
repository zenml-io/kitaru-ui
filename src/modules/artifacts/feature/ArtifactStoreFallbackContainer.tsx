import { VisualizationSkeleton } from "@/modules/checkpoints/ui/VisualizationSkeleton";
import { isFetchError } from "@/shared/api/domain/fetch-error";
import { useArtifactStoreState } from "../business-logic/use-artifact-store-state";
import {
	DepsMissingArtifactStoreFallback,
	GenericArtifactStoreFallback,
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
	const { state, isPending } = useArtifactStoreState(artifactVersionId);

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

	return <GenericArtifactStoreFallback message={error?.message} />;
}
