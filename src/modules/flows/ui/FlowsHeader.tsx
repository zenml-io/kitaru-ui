import { MetricLabel, type MetricLabelProps } from "./MetricLabel";
import { MetricValue, type MetricValueProps } from "./MetricValue";

export interface StatItem {
	label: string;
	value: string | number;
	labelColor?: MetricLabelProps["color"];
	labelSize?: MetricLabelProps["size"];
	valueColor?: MetricValueProps["color"];
	valueSize?: MetricValueProps["size"];
}

type FlowsHeaderProps = {
	stats: StatItem[];
	title: string;
	description: string;
};

export function FlowsHeader({ stats, title, description }: FlowsHeaderProps) {
	return (
		<header className="bg-card border-border w-full shrink-0 border-b">
			<div className="mx-auto flex max-w-[1480px] flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:px-8">
				<div className="flex min-w-0 flex-col gap-1">
					<h1 className="text-foreground text-2xl font-bold tracking-tight text-balance">
						{title}
					</h1>
					<p className="text-muted-foreground mt-0.5 max-w-2xl text-sm text-pretty">
						{description}
					</p>
				</div>
				{stats && stats.length > 0 && (
					<div className="flex flex-wrap items-end gap-x-6 gap-y-3 lg:shrink-0">
						{stats.map((stat) => (
							<div
								key={stat.label}
								className="flex min-w-20 flex-col gap-0.5 text-left sm:text-right"
							>
								<MetricLabel color={stat.labelColor} size={stat.labelSize}>
									{stat.label}
								</MetricLabel>
								<MetricValue
									color={stat.valueColor}
									size={stat.valueSize ?? "lg"}
								>
									{stat.value}
								</MetricValue>
							</div>
						))}
					</div>
				)}
			</div>
		</header>
	);
}
