import type { ReactNode } from "react";

// Semantic color tone for a gap stripe. Generic design-token names — the
// host picks one; hashi owns the actual color ramp (see lib/timeline/gap-styles).
export type TimelineGapTone = "neutral" | "warning";

export interface TimelineNode {
	id: string;
	label: string;
	startMs: number;
	durationMs: number;
	expanded?: boolean;
	children: TimelineNode[];

	// Domain-supplied presentation (filled in by a consumer adapter):
	colorClass: string;
	badge?: ReactNode;
	tooltip?: ReactNode;
	durationLabel?: string;
	accent?: "default" | "primary" | "warning" | "muted";
	pulseMarker?: boolean;
	// Trailing badge pinned to the right edge of the name column.
	nameBadge?: ReactNode;
	// Extra classes merged onto the sticky name cell, e.g. "opacity-50" to
	// recede a row.
	nameCellClassName?: string;

	// Gap behavior — a collapsing node renders as a compact pause stripe instead
	// of a row. The host supplies the stripe's label and tone; the description
	// shows in its tooltip.
	collapsesToGap?: boolean;
	gapLabel?: string;
	gapTone?: TimelineGapTone;
	gapDescription?: string;
}
