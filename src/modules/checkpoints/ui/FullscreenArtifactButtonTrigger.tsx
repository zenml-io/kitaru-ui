import { Button } from "@zenml/hashi/primitives/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@zenml/hashi/primitives/tooltip";
import { DialogTrigger } from "@/shared/ui/dialog";
import { Expand } from "lucide-react";

export function FullscreenArtifactButtonTrigger() {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<DialogTrigger
						render={
							<Button variant="ghost" size="icon-sm">
								<Expand className="text-foreground h-3.5 w-3.5" />
								<span className="sr-only">Fullscreen</span>
							</Button>
						}
					/>
				}
			/>
			<TooltipContent>Fullscreen</TooltipContent>
		</Tooltip>
	);
}
