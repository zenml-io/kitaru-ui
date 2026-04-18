import type { ArtifactVisualization } from "@/modules/checkpoints/domain/visualization";
import { ArtifactContentViewer } from "./ArtifactContentViewer";

interface VisualizationViewerProps {
	artifact: ArtifactVisualization;
}

export function VisualizationViewer({ artifact }: VisualizationViewerProps) {
	return <ArtifactContentViewer artifact={artifact} />;
}
