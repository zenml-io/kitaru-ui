import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";

interface ArtifactVisualizationProps {
	artifactVersionId: string;
}

export function ArtifactVisualization({
	artifactVersionId,
}: ArtifactVisualizationProps) {
	const { visualizationData } = useArtifactVisualization(artifactVersionId);

	if (!visualizationData) return null;

	return <VisualizationViewer artifact={visualizationData} />;
}
