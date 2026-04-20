import { Dialog } from "@/shared/ui/dialog";
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
				<ArtifactVisualizationContainer artifactVersionId={artifactVersionId} />
			</FullscreenArtifactDialogContent>
		</Dialog>
	);
}
