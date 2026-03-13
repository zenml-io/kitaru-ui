import { cva, type VariantProps } from "class-variance-authority";

const metricLabelVariants = cva(
	"text-xs font-semibold uppercase tracking-wider",
	{
		variants: {
			color: {
				default: "text-foreground",
				muted: "text-muted-foreground",
			},
			size: {
				default: "",
				sm: "text-sm",
			},
		},
		defaultVariants: {
			color: "muted",
			size: "default",
		},
	}
);

export type MetricLabelProps = {
	children: React.ReactNode;
} & VariantProps<typeof metricLabelVariants>;

export function MetricLabel({
	children,
	color = "muted",
	size = "default",
}: MetricLabelProps) {
	return (
		<span
			data-slot="metric-label"
			className={metricLabelVariants({ color, size })}
		>
			{children}
		</span>
	);
}
