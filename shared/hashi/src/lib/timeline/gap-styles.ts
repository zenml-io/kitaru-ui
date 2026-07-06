import type { TimelineGapTone } from "@zenml/hashi/lib/timeline/types";

// Single source of truth for gap-stripe colors. Each tone maps to the full
// opacity ramp the stripe needs: the tooltip dot, the axis-header tint, the
// row-area tint, and the hover tint. Literal class strings so Tailwind keeps
// them. The host only picks a tone; hashi owns the ramp.
export interface GapToneStyle {
	dot: string;
	axisBg: string;
	rowBg: string;
	hover: string;
}

export const GAP_TONE_STYLES: Record<TimelineGapTone, GapToneStyle> = {
	neutral: {
		dot: "bg-muted-foreground",
		axisBg: "bg-muted-foreground/10",
		rowBg: "bg-muted-foreground/20",
		hover: "hover:bg-muted-foreground/20",
	},
	warning: {
		dot: "bg-warning",
		axisBg: "bg-warning/10",
		rowBg: "bg-warning/15",
		hover: "hover:bg-warning/25",
	},
};
