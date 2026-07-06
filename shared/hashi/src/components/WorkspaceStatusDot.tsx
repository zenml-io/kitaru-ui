import { ColorDot } from "@zenml/hashi/primitives/color-dot";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zenml/hashi/primitives/tooltip";
import {
	getWorkspaceStatusDotClass,
	getWorkspaceStatusLabel,
	type WorkspaceStatus,
} from "@zenml/hashi/lib/state-styles";
import { cn } from "@zenml/hashi/lib/utils";

export function WorkspaceStatusDot({
	status,
	className,
	withTooltip = false,
}: {
	status: WorkspaceStatus;
	className?: string;
	/** When true, wraps the dot in a Tooltip whose content is the status label. */
	withTooltip?: boolean;
}) {
	const dot = (
		<ColorDot
			shape="round"
			size="xs"
			className={cn(getWorkspaceStatusDotClass(status), className)}
			aria-hidden={!withTooltip}
		/>
	);
	if (!withTooltip) return dot;
	const label = getWorkspaceStatusLabel(status);
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<span
						role="img"
						aria-label={label}
						className="inline-flex items-center justify-center"
					/>
				}
			>
				{dot}
			</TooltipTrigger>
			<TooltipContent side="top">{label}</TooltipContent>
		</Tooltip>
	);
}
