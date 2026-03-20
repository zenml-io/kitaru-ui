import { cva, type VariantProps } from "class-variance-authority";

const metricValueVariants = cva(
	"font-mono font-bold tabular-nums leading-tight",
	{
		variants: {
			color: {
				default: "text-foreground",
				muted: "text-muted-foreground",
				success: "text-emerald-600 dark:text-emerald-400",
				warning: "text-amber-600 dark:text-amber-400",
				danger: "text-destructive",
			},
			size: {
				default: "text-lg",
				xs: "text-xs",
				sm: "text-sm",
				lg: "text-lg",
			},
		},
	}
);

export type MetricValueProps = {
	children: React.ReactNode;
} & VariantProps<typeof metricValueVariants>;

export function MetricValue({
	children,
	color = "default",
	size = "default",
}: MetricValueProps) {
	return (
		<span
			data-slot="metric-value"
			className={metricValueVariants({ color, size })}
		>
			{children}
		</span>
	);
}
