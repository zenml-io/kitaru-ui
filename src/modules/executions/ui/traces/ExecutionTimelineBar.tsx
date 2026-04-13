import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { ColorDot } from "@/shared/ui/ColorDot";
import { getCheckpointFillClass } from "./checkpoint-styles";
import { formatDurationShort } from "@/shared/utils/time";
import { cn } from "@/shared/utils/styles";
import { computeTimelineWidths } from "../../util/timeline-scale";
import type { TimelineEntry } from "../../domain/waiting-block";

type TimelineSegment = {
	id: string;
	name: string;
	type: string;
	durationMs: number;
	entry: TimelineEntry;
};

function toSegment(entry: TimelineEntry): TimelineSegment | null {
	if (entry.kind === "checkpoint") {
		const durationMs = entry.data.durationMs ?? 0;
		if (durationMs <= 0) return null;
		return {
			id: entry.data.id,
			name: entry.data.name,
			type: entry.data.type ?? "",
			durationMs,
			entry,
		};
	}
	const durationMs = entry.data.waitDurationMs ?? 0;
	if (durationMs <= 0) return null;
	return {
		id: entry.data.id,
		name: "User Input",
		type: "wait",
		durationMs,
		entry,
	};
}

type ExecutionTimelineProps = {
	timelineEntries: TimelineEntry[];
	onSelect: (entry: TimelineEntry) => void;
};

export function ExecutionTimelineBar({
	timelineEntries,
	onSelect,
}: ExecutionTimelineProps) {
	const [selectedSegmentId, setSelectedSegmentId] = useState<string>();

	const segments = timelineEntries
		.map(toSegment)
		.filter((s): s is TimelineSegment => s !== null);
	const total = segments.reduce((sum, s) => sum + s.durationMs, 0);
	const widths = computeTimelineWidths(segments.map((s) => s.durationMs));

	if (total === 0) return null;

	const handleSelect = (entry: TimelineEntry) => {
		setSelectedSegmentId(entry.data.id);
		onSelect(entry);
	};

	return (
		<div className="border-border flex shrink-0 items-center border-b px-4 py-2.5">
			<div
				role="toolbar"
				aria-label="Execution timeline"
				className="flex h-7 w-full gap-0.5"
			>
				{segments.map((segment, index, arr) => {
					const isSelected = segment.id === selectedSegmentId;
					const isFirst = index === 0;
					const isLast = index === arr.length - 1;
					const fillClass = getCheckpointFillClass(segment.type);

					return (
						<Tooltip key={segment.id}>
							<TooltipTrigger
								render={
									<button
										type="button"
										onClick={() => handleSelect(segment.entry)}
										aria-label={`${segment.name}, duration ${formatDurationShort(segment.durationMs)}`}
										aria-pressed={isSelected}
										className={cn(
											"relative h-full transition-opacity",
											isFirst && "rounded-l-md",
											isLast && "rounded-r-md",
											fillClass,
											isSelected
												? "ring-foreground opacity-100 ring-2 ring-inset"
												: "opacity-80 hover:opacity-100"
										)}
										style={{ width: `${widths[index]}%`, minWidth: "6px" }}
									/>
								}
							/>
							<TooltipContent
								side="bottom"
								className="block max-w-64 overflow-hidden p-0"
							>
								<div className="border-background/20 flex items-center gap-2 border-b px-3 py-2">
									<ColorDot size="sm" className={cn("shrink-0", fillClass)} />
									<span className="min-w-0 flex-1 truncate font-mono text-xs font-semibold">
										{segment.name}
									</span>
									{segment.type && (
										<span className="text-2xs shrink-0 font-medium opacity-70">
											{segment.type}
										</span>
									)}
								</div>
								<div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2 text-xs">
									<span className="opacity-70">Duration</span>
									<span className="text-right font-mono tabular-nums">
										{formatDurationShort(segment.durationMs)}
									</span>
								</div>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
}
