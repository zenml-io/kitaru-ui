import { Stat, type StatProps } from "./Stat";

export type StatsProps = {
	stats: StatProps[];
};

export function Stats({ stats }: StatsProps) {
	return (
		<div className="flex flex-wrap items-end gap-x-6 gap-y-3 lg:shrink-0">
			{stats.map((stat) => (
				<Stat key={stat.label} {...stat} />
			))}
		</div>
	);
}
