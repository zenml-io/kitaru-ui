import { ErrorBoundary } from "react-error-boundary";
import { ArtifactStoreFallbackContainer } from "@/modules/artifacts/feature/ArtifactStoreFallbackContainer";
import { useArtifactVersion } from "../business-logic/use-artifact-version";
import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationSkeleton } from "../ui/VisualizationSkeleton";
import { NoVisualizationFallback } from "../ui/NoVisualizationFallback";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";
import { VisualizationErrorFallback } from "@/modules/executions/ui/VisualizationErrorFallback";

interface ArtifactVisualizationContainerProps {
	artifactVersionId: string;
}

export function ArtifactVisualizationContainer({
	artifactVersionId,
}: ArtifactVisualizationContainerProps) {
	const versionQuery = useArtifactVersion(artifactVersionId);

	const hasVisualizations =
		(versionQuery.data?.metadata?.visualizations?.length ?? 0) > 0;

	const visualizationQuery = useArtifactVisualization(artifactVersionId, {
		enabled: hasVisualizations,
	});

	if (versionQuery.isPending) {
		return <VisualizationSkeleton />;
	}

	if (versionQuery.isError) {
		return (
			<ArtifactStoreFallbackContainer
				artifactVersionId={artifactVersionId}
				error={versionQuery.error}
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
			<ArtifactStoreFallbackContainer
				artifactVersionId={artifactVersionId}
				error={visualizationQuery.error}
			/>
		);
	}

	return (
		<ErrorBoundary
			resetKeys={[artifactVersionId]}
			FallbackComponent={VisualizationErrorFallback}
		>
			<VisualizationViewer
				key={artifactVersionId}
				artifact={visualizationQuery.data}
			/>
		</ErrorBoundary>
	);
}
