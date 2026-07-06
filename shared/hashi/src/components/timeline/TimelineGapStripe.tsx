import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@zenml/hashi/primitives/tooltip";
import { ColorDot } from "@zenml/hashi/primitives/color-dot";
import { formatDurationShort } from "@zenml/hashi/lib/format";
import { cn } from "@zenml/hashi/lib/utils";
import { GAP_TONE_STYLES } from "@zenml/hashi/lib/timeline/gap-styles";
import type { IdleGap as IdleGapType } from "@zenml/hashi/lib/timeline/time-map";

interface TimelineGapStripeProps {
	gap: IdleGapType;
	className?: string;
}

/**
 * Renders a hit area (with tooltip) covering the full width of a gap column.
 * The coloured column background is rendered separately in the waterfall
 * container so node bars can paint on top cleanly; this overlay adds the hover
 * darkening on top of that base tint.
 *
 * Appearance comes from the gap's `tone` (a generic color ramp owned by hashi)
 * and its host-supplied `label`; the optional `description` shows underneath.
 */
export function TimelineGapStripe({ gap, className }: TimelineGapStripeProps) {
	const widthPct = Math.max(gap.endPct - gap.startPct, 0.2);
	const tone = GAP_TONE_STYLES[gap.tone];
	const title = gap.label ?? "Idle";

	return (
		<Tooltip>
			<TooltipTrigger
				render={<div />}
				aria-hidden="true"
				className={cn(
					"pointer-events-auto absolute top-0 bottom-0 cursor-default bg-transparent transition-colors duration-150",
					tone.hover,
					className
				)}
				style={{ left: `${gap.startPct}%`, width: `${widthPct}%` }}
			/>
			{gap.tooltip ?? (
				<TooltipContent
					side="top"
					className="text-background block max-w-64 overflow-hidden p-0"
				>
					<div className="border-background/20 flex items-center gap-2 border-b px-3 py-2">
						<ColorDot size="sm" className={tone.dot} />
						<span className="text-2xs truncate font-mono font-semibold">
							{title}
						</span>
					</div>
					<div className="text-2xs grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2">
						<span className="opacity-70">Duration</span>
						<span className="text-right font-mono tabular-nums">
							{formatDurationShort(gap.durationMs)}
						</span>
					</div>
					{gap.description && (
						<div className="text-2xs border-background/20 border-t px-3 py-2 text-pretty opacity-80">
							{gap.description}
						</div>
					)}
				</TooltipContent>
			)}
		</Tooltip>
	);
}
