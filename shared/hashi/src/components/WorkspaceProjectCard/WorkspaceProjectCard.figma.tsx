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
			footerSlot: figma.enum("footer", {
				with: (
					<div className="bg-secondary flex items-center justify-between gap-2 rounded-md px-3 py-2 font-mono text-xs">
						<code>kitaru project use model-training</code>
					</div>
				),
			}),
		},
		example: ({ gradient, statisticsSlot, footerSlot }) => (
			<WorkspaceProjectCard
				name="production-traces"
				path="/zenml/production-traces"
				gradient={gradient}
				statisticsSlot={statisticsSlot}
				footerSlot={footerSlot}
			/>
		),
	}
);
