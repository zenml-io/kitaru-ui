import { MetricLabel, type MetricLabelProps } from "./MetricLabel";
import { MetricValue, type MetricValueProps } from "./MetricValue";

export type StatProps = {
	label: string;
	value: React.ReactNode;
	labelColor?: MetricLabelProps["color"];
	labelSize?: MetricLabelProps["size"];
	valueColor?: MetricValueProps["color"];
	valueSize?: MetricValueProps["size"];
};
export function Stat({
	label,
	value,
	labelColor,
	valueColor,
	labelSize,
	valueSize,
}: StatProps) {
	return (
		<div
			key={label}
			className="flex min-w-20 flex-col gap-0.5 text-left sm:text-right"
		>
			<MetricLabel color={labelColor} size={labelSize}>
				{label}
			</MetricLabel>
			<MetricValue color={valueColor} size={valueSize}>
				{value}
			</MetricValue>
		</div>
	);
}
