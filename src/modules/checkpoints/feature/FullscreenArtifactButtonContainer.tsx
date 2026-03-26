import { VisualizationErrorBoundary } from "@/modules/executions/ui/VisualizationErrorBoundary";
import { Dialog } from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
				<ErrorBoundary FallbackComponent={VisualizationErrorBoundary}>
					<Suspense
						fallback={
							<div className="flex flex-col gap-3 p-4">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-32 w-full" />
							</div>
						}
					>
						<ArtifactVisualizationContainer
							artifactVersionId={artifactVersionId}
						/>
					</Suspense>
				</ErrorBoundary>
			</FullscreenArtifactDialogContent>
		</Dialog>
	);
}
