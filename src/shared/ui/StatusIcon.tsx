import {
	Ban,
	CheckCircle2,
	ChevronLast,
	CircleDotDashed,
	CircleHelp,
	CirclePause,
	CircleStop,
	Clock,
	Database,
	Loader2,
	RefreshCw,
	RotateCcw,
	RotateCw,
	XCircle,
	type LucideIcon,
} from "lucide-react";
import type { components } from "@/shared/api/openapi";
import { cn } from "@/shared/utils/styles";
import { Tooltip, TooltipContent, TooltipTrigger } from "@zenml/hashi/primitives/tooltip";

export type StatusIconVariant =
	| components["schemas"]["ExecutionStatus"]
	| "unknown";

type IconSpec = {
	icon: LucideIcon;
	className: string;
	label: string;
	spin?: boolean;
	pulse?: boolean;
};

const ICON_MAP: Record<StatusIconVariant, IconSpec> = {
	completed: {
		icon: CheckCircle2,
		className: "text-success",
		label: "Completed",
	},
	failed: { icon: XCircle, className: "text-destructive", label: "Failed" },
	running: {
		icon: Loader2,
		className: "text-warning",
		label: "Running",
		spin: true,
	},
	retrying: {
		icon: RotateCw,
		className: "text-warning",
		label: "Retrying",
		spin: true,
	},
	initializing: {
		icon: Loader2,
		className: "text-info",
		label: "Initializing",
		spin: true,
	},
	provisioning: {
		icon: CircleDotDashed,
		className: "text-info",
		label: "Provisioning",
	},
	queued: { icon: Clock, className: "text-info", label: "Queued" },
	resuming: {
		icon: RefreshCw,
		className: "text-info",
		label: "Resuming",
		spin: true,
	},
	paused: {
		icon: CirclePause,
		className: "text-muted-foreground",
		label: "Paused",
	},
	cached: {
		icon: Database,
		className: "text-muted-foreground",
		label: "Cached",
	},
	skipped: {
		icon: ChevronLast,
		className: "text-muted-foreground",
		label: "Skipped",
	},
	stopped: {
		icon: CircleStop,
		className: "text-muted-foreground",
		label: "Stopped",
	},
	stopping: {
		icon: CircleStop,
		className: "text-muted-foreground",
		label: "Stopping",
		pulse: true,
	},
	retried: {
		icon: RotateCcw,
		className: "text-muted-foreground",
		label: "Retried",
	},
	cancelling: {
		icon: Ban,
		className: "text-muted-foreground",
		label: "Cancelling",
		pulse: true,
	},
	cancelled: {
		icon: Ban,
		className: "text-muted-foreground",
		label: "Cancelled",
	},
	unknown: { icon: CircleHelp, className: "text-info", label: "Unknown" },
};

type StatusIconProps = {
	status: StatusIconVariant;
	size?: string;
	withTooltip?: boolean;
	tooltipSide?: "top" | "bottom" | "left" | "right";
	label?: string;
};

function StatusIcon({
	status,
	size = "size-3.5",
	withTooltip = true,
	tooltipSide = "bottom",
	label,
}: StatusIconProps) {
	const spec = ICON_MAP[status];
	const Icon = spec.icon;
	const resolvedLabel = label ?? spec.label;

	const iconNode = (
		<Icon
			data-slot="status-icon"
			data-status={status}
			className={cn(
				"shrink-0",
				size,
				spec.className,
				spec.spin && "motion-safe:animate-spin",
				spec.pulse && "motion-safe:animate-pulse"
			)}
			aria-hidden={withTooltip ? "true" : undefined}
			aria-label={withTooltip ? undefined : resolvedLabel}
		/>
	);

	if (!withTooltip) return iconNode;

	return (
		<Tooltip>
			<TooltipTrigger
				render={<span className="inline-flex shrink-0" />}
				aria-label={resolvedLabel}
			>
				{iconNode}
			</TooltipTrigger>
			<TooltipContent side={tooltipSide}>{resolvedLabel}</TooltipContent>
		</Tooltip>
	);
}

export { StatusIcon };
