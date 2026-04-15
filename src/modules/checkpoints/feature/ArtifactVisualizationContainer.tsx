import { useArtifactVersion } from "../business-logic/use-artifact-version";
import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationSkeleton } from "../ui/VisualizationSkeleton";
import { NoVisualizationFallback } from "../ui/NoVisualizationFallback";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";
import { VisualizationErrorBoundary } from "@/modules/executions/ui/VisualizationErrorBoundary";

interface ArtifactVisualizationContainerProps {
	artifactVersionId: string;
}

export function ArtifactVisualizationContainer({
	artifactVersionId,
}: ArtifactVisualizationContainerProps) {
	const versionQuery = useArtifactVersion(artifactVersionId);

	const hasVisualizations =
		(versionQuery.artifactVersion?.metadata?.visualizations?.length ?? 0) > 0;

	const visualizationQuery = useArtifactVisualization(artifactVersionId, {
		enabled: hasVisualizations,
	});

	if (versionQuery.isPending) {
		return <VisualizationSkeleton />;
	}

	if (versionQuery.isError) {
		return (
			<VisualizationErrorBoundary
				error={versionQuery.error}
				resetErrorBoundary={() => versionQuery.refetch()}
			/>
		);
	}

	if (!hasVisualizations) {
		return <NoVisualizationFallback />;
	}

	if (visualizationQuery.isPending) {
		return <VisualizationSkeleton />;
	}

	if (visualizationQuery.isError) {
		return (
			<VisualizationErrorBoundary
				error={visualizationQuery.error}
				resetErrorBoundary={() => visualizationQuery.refetch()}
			/>
		);
	}

	return (
		<VisualizationViewer
			key={artifactVersionId}
			artifact={visualizationQuery.visualizationData}
		/>
	);
}
