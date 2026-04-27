import { Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { useArtifactStoreState } from "@/modules/artifacts/business-logic/use-artifact-store-state";
import { getDownloadUnavailableReason } from "@/modules/artifacts/business-logic/download-availability";
import { useDownloadArtifact } from "../business-logic/use-download-artifact";

type Props = {
	artifactVersionId: string;
};

export function DownloadArtifactButtonContainer({ artifactVersionId }: Props) {
	const { download, isDownloading } = useDownloadArtifact();
	const { state } = useArtifactStoreState(artifactVersionId);
	const unavailableReason = getDownloadUnavailableReason(state);
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
