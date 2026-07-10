import figma from "@figma/code-connect";

import { WorkspaceTypeVersionBadge } from "./WorkspaceTypeVersionBadge";

figma.connect(
	WorkspaceTypeVersionBadge,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=90-15",
	{
		props: {
			type: figma.enum("type", {
				zenml: "zenml",
				kitaru: "kitaru",
			}),
			version: figma.string("Version"),
		},
		example: ({ type, version }) => (
			<WorkspaceTypeVersionBadge type={type} version={version} />
		),
	}
);
