import figma from "@figma/code-connect";

import { Progress, ProgressLabel, ProgressValue } from "./progress";

// Split per variant: a null value inside figma.enum crashes the figma
// connect CLI at publish time (TypeError on 'kind' in null), so the
// indeterminate example hardcodes value={null} instead.
figma.connect(
	Progress,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=250-17",
	{
		variant: { state: "determinate" },
		example: () => (
			<Progress value={60}>
				<ProgressLabel>Training epochs</ProgressLabel>
				<ProgressValue />
			</Progress>
		),
	}
);

figma.connect(
	Progress,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=250-17",
	{
		variant: { state: "indeterminate" },
		example: () => (
			<Progress value={null}>
				<ProgressLabel>Training epochs</ProgressLabel>
				<ProgressValue />
			</Progress>
		),
	}
);
