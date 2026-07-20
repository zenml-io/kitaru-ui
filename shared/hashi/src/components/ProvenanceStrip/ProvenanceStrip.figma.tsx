import figma from "@figma/code-connect";

import { ProvenanceStrip } from "./ProvenanceStrip";

figma.connect(
	ProvenanceStrip,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=416-1335",
	{
		props: {
			role: figma.enum("role", {
				Replay: "replay",
				Original: "original",
			}),
		},
		example: ({ role }) => (
			<ProvenanceStrip
				role={role}
				source="#151"
				// comparison is a runtime-supplied link rendered by the consuming app
				comparison={<a href="#compare-151-152">Compare</a>}
				stats={[{ label: "Reused", value: "6 of 8" }]}
			/>
		),
	}
);
