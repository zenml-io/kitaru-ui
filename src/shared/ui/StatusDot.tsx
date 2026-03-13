import { cva, type VariantProps } from "class-variance-authority";

const statusDotVariants = cva(
	"inline-block h-[7px] w-[7px] shrink-0 rounded-full",
	{
		variants: {
			status: {
				completed: "bg-success",
				failed: "bg-destructive",
				initializing: "bg-purple-500",
				provisioning: "bg-purple-500",
				running: "bg-warning",
				retrying: "bg-warning",
				cached: "bg-gray-400",
				skipped: "bg-gray-400",
				stopped: "bg-gray-400",
				stopping: "bg-gray-400",
				retried: "bg-gray-400",
				unknown: "bg-blue-500",
			},
		},
		defaultVariants: {
			status: "unknown",
		},
	}
);

export type StatusDotVariant = NonNullable<
	VariantProps<typeof statusDotVariants>["status"]
>;

function StatusDot({ status }: { status: StatusDotVariant }) {
	return (
		<span
			data-slot="status-dot"
			data-status={status}
			className={statusDotVariants({ status })}
		/>
	);
}

export { StatusDot };
