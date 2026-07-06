import figma from "@figma/code-connect";

import { WorkspaceAvatar } from "./WorkspaceAvatar";

figma.connect(
	WorkspaceAvatar,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=89-13",
	{
		props: {
			type: figma.enum("type", {
				zenml: "zenml",
				kitaru: "kitaru",
			}),
			// Code default size is "2xl" — omitted from the map.
			size: figma.enum("size", {
				default: "default",
				lg: "lg",
				xl: "xl",
			}),
		},
		example: ({ type, size }) => (
			<WorkspaceAvatar
				workspace={{ slug: "my-workspace", name: "My Workspace", type }}
				size={size}
			/>
		),
	}
);
