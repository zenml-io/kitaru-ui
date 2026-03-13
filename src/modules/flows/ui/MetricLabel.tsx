import { cva, type VariantProps } from "class-variance-authority";

const metricLabelVariants = cva("font-semibold uppercase tracking-wider", {
	variants: {
		color: {
			default: "text-foreground",
			muted: "text-muted-foreground",
		},
		size: {
			default: "text-xs",
			xs: "text-xs",
			sm: "text-sm",
			lg: "text-lg",
		},
	},
});

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
