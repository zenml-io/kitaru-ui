import { IconButton } from "@zenml/hashi/primitives/icon-button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zenml/hashi/primitives/tooltip";
import { ChevronRight } from "lucide-react";
import { cn } from "@zenml/hashi/lib/utils";
import { formatDurationShort } from "@zenml/hashi/lib/format";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";
import type { TimeMap } from "@zenml/hashi/lib/timeline/time-map";

interface TimelineRowProps {
	node: TimelineNode;
	depth: number;
	isSelected: boolean;
	onSelect: (id: string) => void;
	/** Expand/collapse handler; omit for flat rows that never render the toggle. */
	onToggle?: (id: string) => void;
	hasChildren: boolean;
	nameColWidth: number;
	timeMap: TimeMap;
	rightPadPx: number;
	leftPadPx: number;
}

export function TimelineRow({
	node,
	depth,
	isSelected,
	onSelect,
	onToggle,
	hasChildren,
	nameColWidth,
	timeMap,
	rightPadPx,
	leftPadPx,
}: TimelineRowProps) {
	const leftPct = timeMap.msToPct(node.startMs);
	const endPct = timeMap.msToPct(node.startMs + node.durationMs);
	const widthPct = Math.max(endPct - leftPct, 0.5);
	const toggleOffset = 12 + depth * 20;
	const durationLabelPx = 48;
	const durationGapPx = 8;
	const minTrackPadPx = 8;
	const trackPadPx = Math.max(
		rightPadPx - durationLabelPx - durationGapPx,
		minTrackPadPx
	);
	const tooltipHitboxPct = Math.max(widthPct, 0.8);
	const accent = node.accent ?? "default";

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelect(node.id);
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			aria-pressed={isSelected}
			onClick={() => onSelect(node.id)}
			onKeyDown={handleKeyDown}
			className={cn(
				"group border-border focus-visible:ring-primary relative flex h-10 cursor-pointer items-center border-b transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset",
				isSelected ? "bg-accent" : "hover:bg-accent/60"
			)}
		>
			<div className="flex w-full items-center">
				<div
					className={cn(
						"border-border sticky left-0 z-10 flex h-10 min-w-0 shrink-0 items-center gap-0 overflow-hidden border-r pl-3 transition-colors",
						isSelected ? "bg-accent" : "bg-background group-hover:bg-accent",
						node.nameCellClassName
					)}
					style={{ width: nameColWidth }}
				>
					{isSelected && (
						<div className="bg-primary absolute top-0 bottom-0 left-0 w-[3px]" />
					)}
					{hasChildren && (
						<IconButton
							icon={<ChevronRight className="h-2.5 w-2.5" />}
							label={node.expanded ? "Collapse" : "Expand"}
							className={cn(
								"text-muted-foreground hover:text-foreground absolute top-1/2 -translate-y-1/2",
								node.expanded && "rotate-90"
							)}
							style={{ left: toggleOffset }}
							size="icon-xs"
							onPointerDown={(e) => e.stopPropagation()}
							onClick={(e) => {
								e.stopPropagation();
								onToggle?.(node.id);
							}}
						/>
					)}
					{Array.from({ length: depth }).map((_, i) => (
						<span key={i} className="inline-block w-5 shrink-0" />
					))}
					<span
						className={cn(
							"mr-1 inline-block shrink-0",
							hasChildren ? "w-7" : "w-4"
						)}
					/>
					{node.badge && <span className="mr-2 shrink-0">{node.badge}</span>}
					<Tooltip>
						<TooltipTrigger
							render={
								<span className="text-foreground min-w-0 truncate font-mono text-xs" />
							}
						>
							{node.label}
						</TooltipTrigger>
						<TooltipContent side="bottom">{node.label}</TooltipContent>
					</Tooltip>
					{node.nameBadge && (
						<span className="ml-auto shrink-0 pr-3">{node.nameBadge}</span>
					)}
				</div>

				{/* Waterfall */}
				<div
					className="relative flex h-full min-w-0 flex-1 items-center"
					style={{ paddingLeft: leftPadPx, paddingRight: trackPadPx }}
				>
					<div className="bg-foreground/10 relative h-3.5 flex-1 rounded-sm">
						<Tooltip trackCursorAxis="x">
							<TooltipTrigger
								render={<div />}
								className="absolute top-0 z-10 h-full min-w-[6px]"
								style={{
									left: `${leftPct}%`,
									width: `${tooltipHitboxPct}%`,
								}}
								aria-label={`${node.label} — ${formatDurationShort(node.durationMs)}`}
							/>
							{node.tooltip}
						</Tooltip>
						<div
							className={cn(
								"absolute top-0 h-full min-w-[3px] rounded-sm",
								node.colorClass
							)}
							style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
						/>
						{node.pulseMarker && (
							<div
								className="bg-warning absolute top-[-3px] bottom-[-3px] w-0.5 animate-pulse rounded-sm"
								style={{ left: `${leftPct}%` }}
							/>
						)}
					</div>
					<span
						className={cn(
							"text-2xs ml-2 w-12 shrink-0 text-right font-mono tabular-nums",
							isSelected
								? "text-primary font-semibold"
								: accent === "warning"
									? "text-warning font-semibold"
									: accent === "muted"
										? "text-muted-foreground font-semibold"
										: accent === "primary"
											? "text-primary font-semibold"
											: "text-muted-foreground"
						)}
					>
						{node.durationLabel ?? formatDurationShort(node.durationMs)}
					</span>
				</div>
			</div>
		</div>
	);
}
