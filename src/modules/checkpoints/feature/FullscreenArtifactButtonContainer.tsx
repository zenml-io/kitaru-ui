import { Dialog } from "@/shared/ui/dialog";
import { ViewerFrameFullHeight } from "@/modules/executions/ui/traces/ViewerFrame";
import { FullscreenArtifactButtonTrigger } from "../ui/FullscreenArtifactButtonTrigger";
import { FullscreenArtifactDialogContent } from "../ui/FullscreenArtifactDialogContent";
import { ArtifactVisualizationContainer } from "./ArtifactVisualizationContainer";
import { DownloadArtifactButtonContainer } from "./DownloadArtifactButtonContainer";

type Props = {
	artifactVersionId: string;
	name: string;
};

export function FullscreenArtifactButtonContainer({
	artifactVersionId,
	name,
}: Props) {
	return (
		<Dialog>
			<FullscreenArtifactButtonTrigger />
			<FullscreenArtifactDialogContent
				name={name}
				actions={
					<DownloadArtifactButtonContainer
						artifactVersionId={artifactVersionId}
					/>
				}
			>
				<ViewerFrameFullHeight>
					<ArtifactVisualizationContainer
						artifactVersionId={artifactVersionId}
					/>
				</ViewerFrameFullHeight>
			</FullscreenArtifactDialogContent>
		</Dialog>
	);
}
