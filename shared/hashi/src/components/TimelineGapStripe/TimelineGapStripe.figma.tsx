import figma from "@figma/code-connect";

import { TimelineGapStripe } from "./TimelineGapStripe";

// The Figma component shows the stripe's two visual artifacts: the tinted
// band (painted by the waterfall from the same tone ramp) and the tooltip.
// In code the stripe is the transparent hover target that owns the tooltip;
// startPct/endPct/durationMs come from the TimeMap's materialized IdleGap.
figma.connect(
	TimelineGapStripe,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=350-1224",
	{
		props: {
			tone: figma.enum("tone", {
				neutral: "neutral",
				warning: "warning",
			}),
			description: figma.boolean("hasDescription", {
				true: "Waiting for an available A100 in the training pool.",
				false: undefined,
			}),
		},
		example: ({ tone, description }) => (
			<TimelineGapStripe
				gap={{
					startMs: 15200,
					endMs: 105200,
					durationMs: 90000,
					startPct: 32,
					endPct: 45,
					kind: "marked",
					tone,
					label: "Queued for GPU",
					description,
				}}
			/>
		),
	}
);
