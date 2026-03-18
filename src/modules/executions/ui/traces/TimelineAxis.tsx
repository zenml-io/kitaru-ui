import { formatDurationShort } from "@/shared/utils/time";

export function TimelineAxis({ totalMs }: { totalMs: number }) {
	const ticks = 5;
	return (
		<div
			className="text-muted-foreground relative h-5 flex-1 font-mono text-xs tabular-nums"
			style={{ marginRight: "5.5rem" }}
		>
			{Array.from({ length: ticks + 1 }).map((_, i) => {
				const pct = (i / ticks) * 100;
				const ms = (i / ticks) * totalMs;
				return (
					<div key={i} className="absolute top-0" style={{ left: `${pct}%` }}>
						<span
							className="block whitespace-nowrap"
							style={{
								transform:
									i === 0
										? "translateX(0)"
										: i === ticks
											? "translateX(-100%)"
											: "translateX(-50%)",
							}}
						>
							{formatDurationShort(ms)}
						</span>
						<span className="bg-border mt-0.5 block h-1.5 w-px -translate-x-1/2" />
					</div>
				);
			})}
		</div>
	);
}
