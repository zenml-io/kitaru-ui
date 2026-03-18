import { cva, type VariantProps } from "class-variance-authority";
import { ColorDot } from "./ColorDot";

const statusDotVariants = cva("", {
	variants: {
		status: {
			completed: "bg-success",
			failed: "bg-destructive",
			initializing: "bg-purple-500",
			provisioning: "bg-purple-500",
			resuming: "bg-purple-500",
			running: "bg-warning",
			retrying: "bg-warning",
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

function StatusDot({ status }: { status: StatusDotVariant }) {
	return (
		<ColorDot
			shape="round"
			size="sm"
			data-slot="status-dot"
			data-status={status}
			className={statusDotVariants({ status })}
		/>
	);
}

export { StatusDot };
