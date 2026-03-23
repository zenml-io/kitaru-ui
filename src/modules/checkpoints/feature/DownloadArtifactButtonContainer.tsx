import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Download01 } from "@untitledui/icons";
import { useDownloadArtifact } from "../business-logic/use-download-artifact";

type Props = {
	artifactVersionId: string;
};

export function DownloadArtifactButtonContainer({ artifactVersionId }: Props) {
	const { download, isDownloading } = useDownloadArtifact();

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						variant="ghost"
						size="icon-sm"
						disabled={isDownloading}
						onClick={() => download(artifactVersionId)}
					/>
				}
			>
				<Download01 className="text-foreground h-3.5 w-3.5" />
				<span className="sr-only">Download artifact</span>
			</TooltipTrigger>
			<TooltipContent>Download</TooltipContent>
		</Tooltip>
	);
}
