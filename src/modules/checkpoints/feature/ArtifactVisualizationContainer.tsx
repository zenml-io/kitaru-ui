import { useQuery } from "@tanstack/react-query";
import { checkpointsQueries } from "../business-logic/checkpoints-queries";
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
	const versionQuery = useQuery(checkpointsQueries.version(artifactVersionId));

	const hasVisualizations =
		(versionQuery.data?.metadata?.visualizations?.length ?? 0) > 0;

	const visualizationQuery = useQuery({
		...checkpointsQueries.visualization(artifactVersionId),
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
			artifact={visualizationQuery.data}
		/>
	);
}
