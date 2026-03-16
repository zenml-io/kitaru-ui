import { formatDurationShort } from "@/shared/utils/time";

export function TimelineAxis({ totalMs }: { totalMs: number }) {
	const ticks = 5;
	return (
		<div
			className="text-muted-foreground relative h-5 flex-1 font-mono text-xs tabular-nums"
			style={{ marginRight: "3.5rem" }}
		>
			{Array.from({ length: ticks + 1 }).map((_, i) => {
				const pct = (i / ticks) * 100;
				const ms = (i / ticks) * totalMs;
				return (
					<span
						key={i}
						className="absolute top-0 whitespace-nowrap"
						style={{
							left: `${pct}%`,
							transform:
								i === 0
									? "translateX(0)"
									: i === ticks
										? "translateX(-100%)"
										: "translateX(-50%)",
						}}
					>
						{formatDurationShort(ms)}
						<span className="bg-border mx-auto mt-0.5 block h-1.5 w-px" />
					</span>
				);
			})}
		</div>
	);
}
