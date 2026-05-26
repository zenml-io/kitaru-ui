import { cva, type VariantProps } from "class-variance-authority";
import { ColorDot } from "./ColorDot";
import { Tooltip, TooltipContent, TooltipTrigger } from "@zenml/hashi/primitives/tooltip";

const statusDotVariants = cva("", {
	variants: {
		status: {
			completed: "bg-success",
			failed: "bg-destructive",
			initializing: "bg-purple-500",
			provisioning: "bg-purple-500",
			queued: "bg-purple-500",
			resuming: "bg-purple-500",
			running: "bg-warning",
			retrying: "bg-warning",
			cancelling: "bg-gray-400",
			cancelled: "bg-gray-400",
			cached: "bg-gray-400",
			skipped: "bg-gray-400",
			stopped: "bg-gray-400",
			stopping: "bg-gray-400",
			retried: "bg-gray-400",
			paused: "bg-gray-400",
			unknown: "bg-blue-500",
		},
	},
	defaultVariants: {
		status: "unknown",
	},
});

export type StatusDotVariant = NonNullable<
	VariantProps<typeof statusDotVariants>["status"]
>;

function StatusDot({
	status,
	showTooltip = true,
}: {
	status: StatusDotVariant;
	showTooltip?: boolean;
}) {
	const dot = (
		<ColorDot
			shape="round"
			size="sm"
			data-slot="status-dot"
			data-status={status}
			className={statusDotVariants({ status })}
		/>
	);

	if (!showTooltip) return dot;

	return (
		<Tooltip>
			<TooltipTrigger render={dot} />
			<TooltipContent>
				<span className="capitalize">{status}</span>
			</TooltipContent>
		</Tooltip>
	);
}

export { StatusDot };
