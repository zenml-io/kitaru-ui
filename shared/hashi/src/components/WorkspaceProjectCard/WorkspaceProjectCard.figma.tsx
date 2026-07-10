import figma from "@figma/code-connect";

import {
	ProjectStatistics,
	WorkspaceProjectCard,
} from "./WorkspaceProjectCard";

figma.connect(
	WorkspaceProjectCard,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=292-930",
	{
		props: {
			gradient: figma.enum("gradient", {
				"zen-green": "zen-green",
				"zen-slate": "zen-slate",
				"zen-sand": "zen-sand",
				"kitaru-amber": "kitaru-amber",
			}),
			statisticsSlot: figma.enum("statistics", {
				with: <ProjectStatistics flows={12} executions={847} />,
			}),
		},
		example: ({ gradient, statisticsSlot }) => (
			<WorkspaceProjectCard
				name="production-traces"
				path="/zenml/production-traces"
				gradient={gradient}
				statisticsSlot={statisticsSlot}
			/>
		),
	}
);
