import { VisualizationErrorBoundary } from "@/modules/executions/ui/VisualizationErrorBoundary";
import { Dialog } from "@/shared/ui/dialog";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FullscreenArtifactButtonTrigger } from "../ui/FullscreenArtifactButtonTrigger";
import { FullscreenArtifactDialogContent } from "../ui/FullscreenArtifactDialogContent";
import { VisualizationSkeleton } from "../ui/VisualizationSkeleton";
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
				<ErrorBoundary FallbackComponent={VisualizationErrorBoundary}>
					<Suspense fallback={<VisualizationSkeleton />}>
						<ArtifactVisualizationContainer
							artifactVersionId={artifactVersionId}
						/>
					</Suspense>
				</ErrorBoundary>
			</FullscreenArtifactDialogContent>
		</Dialog>
	);
}
