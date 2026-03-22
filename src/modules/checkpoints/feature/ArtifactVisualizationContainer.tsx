// src/modules/checkpoints/feature/ArtifactVisualizationContainer.tsx
import { useDownloadVisualization } from "../business-logic/use-download-visualization";
import { useArtifactVisualization } from "../business-logic/use-artifact-visualization";
import { VisualizationViewer } from "@/modules/executions/ui/traces/VisualizationViewer";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/styles";
import { Download01 } from "@untitledui/icons";

interface ArtifactVisualizationContainerProps {
	artifactVersionId: string;
	filename: string;
}

export function ArtifactVisualizationContainer({
	artifactVersionId,
	filename,
}: ArtifactVisualizationContainerProps) {
	const { visualizationData } = useArtifactVisualization(artifactVersionId);
	const { download, isDownloading } = useDownloadVisualization();

	const isHtml = visualizationData.type === "html";

	return (
		<div className="group/viz relative">
			<VisualizationViewer artifact={visualizationData} />
			<Button
				variant="ghost"
				size="icon-sm"
				className={cn(
					"absolute top-2 right-2 z-10 transition-opacity",
					isHtml ? "opacity-100" : "opacity-0 group-hover/viz:opacity-100"
				)}
				disabled={isDownloading}
				onClick={() => download(visualizationData, filename)}
			>
				<Download01 className="text-muted-foreground h-3.5 w-3.5" />
				<span className="sr-only">Download artifact</span>
			</Button>
		</div>
	);
}
