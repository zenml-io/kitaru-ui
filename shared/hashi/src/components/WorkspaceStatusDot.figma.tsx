import figma from "@figma/code-connect";

import { WorkspaceStatusDot } from "./WorkspaceStatusDot";

figma.connect(
	WorkspaceStatusDot,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=88-8",
	{
		props: {
			status: figma.enum("status", {
				running: "running",
				degraded: "degraded",
				idle: "idle",
			}),
		},
		example: ({ status }) => <WorkspaceStatusDot status={status} />,
	}
);
