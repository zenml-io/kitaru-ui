import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";

interface ArtifactVisualizationContainerProps {
	artifactVersionId: string;
}

export function ArtifactVisualizationContainer({
	artifactVersionId,
}: ArtifactVisualizationContainerProps) {
	const { visualizationData } = useArtifactVisualization(artifactVersionId);

	return (
		<VisualizationViewer key={artifactVersionId} artifact={visualizationData} />
	);
}
