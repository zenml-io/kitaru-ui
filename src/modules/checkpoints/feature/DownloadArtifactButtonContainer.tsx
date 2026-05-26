import { Download } from "lucide-react";
import { Button } from "@zenml/hashi/primitives/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@zenml/hashi/primitives/tooltip";
import { useArtifactStoreState } from "@/modules/artifacts/business-logic/use-artifact-store-state";
import { getDownloadUnavailableReason } from "@/modules/artifacts/business-logic/download-availability";
import { useDownloadArtifact } from "../business-logic/use-download-artifact";

type Props = {
	artifactVersionId: string;
};

export function DownloadArtifactButtonContainer({ artifactVersionId }: Props) {
	const { download, isDownloading } = useDownloadArtifact();
	const { state, storeError } = useArtifactStoreState(artifactVersionId);
	const unavailableReason = storeError
		? "Download unavailable — could not load artifact store information."
		: getDownloadUnavailableReason(state);
	const isDisabled = isDownloading || !!unavailableReason;

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<span>
						<Button
							variant="ghost"
							size="icon-sm"
							disabled={isDisabled}
							onClick={() => download(artifactVersionId)}
						>
							<Download className="text-foreground h-3.5 w-3.5" />
							<span className="sr-only">Download artifact</span>
						</Button>
					</span>
				}
			/>
			<TooltipContent>{unavailableReason ?? "Download"}</TooltipContent>
		</Tooltip>
	);
}
