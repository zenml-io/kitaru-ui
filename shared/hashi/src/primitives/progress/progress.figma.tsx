import figma from "@figma/code-connect";

import { Progress, ProgressLabel, ProgressValue } from "./progress";

figma.connect(
	Progress,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=250-17",
	{
		props: {
			// Indeterminate = value {null}; determinate shows the fill percentage.
			value: figma.enum("state", {
				determinate: 60,
				indeterminate: null,
			}),
		},
		example: ({ value }) => (
			<Progress value={value}>
				<ProgressLabel>Training epochs</ProgressLabel>
				<ProgressValue />
			</Progress>
		),
	}
);
