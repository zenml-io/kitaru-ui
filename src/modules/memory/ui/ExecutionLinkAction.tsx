import { Link } from "@tanstack/react-router";
import { ArrowRight } from "@untitledui/icons";
import { Badge } from "@/shared/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

type ExecutionLinkActionProps = {
	flowId: string;
	executionId?: string;
	iconSize?: string;
};

export function ExecutionLinkAction({
	flowId,
	executionId,
	iconSize = "size-3.5",
}: ExecutionLinkActionProps) {
	if (!executionId) {
		return (
			<Badge variant="outline" className="text-2xs shrink-0">
				external
			</Badge>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Link
						to="/flows/$flowId/executions/$executionId"
						params={{ flowId, executionId }}
						onClick={(e: React.MouseEvent) => e.stopPropagation()}
						className="text-muted-foreground hover:text-foreground shrink-0"
					>
						<ArrowRight className={iconSize} />
						<span className="sr-only">Go to execution</span>
					</Link>
				}
			/>
			<TooltipContent>Go to execution</TooltipContent>
		</Tooltip>
	);
}
