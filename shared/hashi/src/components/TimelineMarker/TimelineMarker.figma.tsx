import figma from "@figma/code-connect";

import { TimelineMarker } from "./TimelineMarker";

// positionPct drives where the marker sits on the rail at runtime; it is not
// a Figma axis. The label variant is the only structural difference: omit
// label for the compact icon-only grip.
figma.connect(
	TimelineMarker,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=356-67",
	{
		props: {
			label: figma.enum("label", {
				"with-text": "Start here",
				"icon-only": undefined,
			}),
		},
		example: ({ label }) => (
			<TimelineMarker
				positionPct={32}
				ariaLabel="Replay start at train_classifier. Use the arrow keys to move it."
				label={label}
				leftInsetPx={270}
				rightInsetPx={80}
				onDrag={() => {}}
				onStep={() => {}}
			/>
		),
	}
);
