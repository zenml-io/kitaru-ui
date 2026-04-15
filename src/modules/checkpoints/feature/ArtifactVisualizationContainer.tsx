import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useArtifactVersion } from "../business-logic/use-artifact-version";
import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationSkeleton } from "../ui/VisualizationSkeleton";
import { NoVisualizationFallback } from "../ui/NoVisualizationFallback";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";
import { VisualizationErrorBoundary } from "@/modules/executions/ui/VisualizationErrorBoundary";

interface ArtifactVisualizationContainerProps {
	artifactVersionId: string;
}

function VisualizationFetchContainer({
	artifactVersionId,
}: {
	artifactVersionId: string;
}) {
	const { visualizationData } = useArtifactVisualization(artifactVersionId);
	return (
		<VisualizationViewer key={artifactVersionId} artifact={visualizationData} />
	);
}

export function ArtifactVisualizationContainer({
	artifactVersionId,
}: ArtifactVisualizationContainerProps) {
	const { artifactVersion } = useArtifactVersion(artifactVersionId);

	const hasVisualizations =
		(artifactVersion.metadata?.visualizations?.length ?? 0) > 0;

	if (!hasVisualizations) {
		return <NoVisualizationFallback artifactVersion={artifactVersion} />;
	}

	return (
		<Suspense fallback={<VisualizationSkeleton />}>
			<ErrorBoundary FallbackComponent={VisualizationErrorBoundary}>
				<VisualizationFetchContainer artifactVersionId={artifactVersionId} />
			</ErrorBoundary>
		</Suspense>
	);
}
