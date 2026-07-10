import figma from "@figma/code-connect";

import { TimelineAxis } from "./TimelineAxis";

// gapContext is a presentation-only Figma axis: the tinted idle band on the
// with-gap-tint variant is composed by the waterfall header (see
// TimelineWaterfall), not rendered by TimelineAxis itself. Both variants map
// to the same plain usage; the ruler always derives its ticks from timeMap.
figma.connect(
	TimelineAxis,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=349-1197",
	{
		example: () => (
			<TimelineAxis timeMap={timeMap} leftPadPx={6} rightPadPx={80} />
		),
	}
);
