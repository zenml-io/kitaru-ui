import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@zenml/hashi/primitives/tooltip";
import { ColorDot } from "@/shared/ui/ColorDot";
import { getCheckpointFillClass } from "./checkpoint-styles";
import { formatDurationShort } from "@/shared/utils/time";
import { cn } from "@/shared/utils/styles";
import { computeTimelineWidths } from "../../util/timeline-scale";
import type { TimelineEntry } from "../../domain/waiting-block";
import type { TimelineSegment } from "../../domain/timeline-segment";
import { timelineEntryToSegment } from "../../business-logic/timeline-entry-to-segment";

type ExecutionTimelineBarProps = {
	timelineEntries: TimelineEntry[];
	onSelect: (entry: TimelineEntry) => void;
};

export function ExecutionTimelineBar({
	timelineEntries,
	onSelect,
}: ExecutionTimelineBarProps) {
	const [selectedSegmentId, setSelectedSegmentId] = useState<string>();

	const segments = timelineEntries
		.map(timelineEntryToSegment)
		.filter((s): s is TimelineSegment => s !== null);
	if (segments.length === 0) return null;
	const widths = computeTimelineWidths(segments.map((s) => s.durationMs));

	const handleSelect = (entry: TimelineEntry) => {
		setSelectedSegmentId(entry.data.id);
		onSelect(entry);
	};

	return (
		<div className="border-border shrink-0 border-b px-4 py-2.5">
			<div className="overflow-x-auto">
				<div
					role="toolbar"
					aria-label="Execution timeline"
					className="flex h-7 gap-0.5"
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
												"relative h-full min-w-[6px] transition-opacity",
												isFirst && "rounded-l-md",
												isLast && "rounded-r-md",
												fillClass,
												isSelected
													? "ring-foreground opacity-100 ring-2 ring-inset"
													: "opacity-80 hover:opacity-100"
											)}
											style={{ width: `${widths[index]}%` }}
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
		</div>
	);
}
