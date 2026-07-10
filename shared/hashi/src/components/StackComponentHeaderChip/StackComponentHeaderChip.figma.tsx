import figma from "@figma/code-connect";

import { StackComponentHeaderChip } from "./StackComponentHeaderChip";

figma.connect(
	StackComponentHeaderChip,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=255-17",
	{
		props: {
			permissionDenied: figma.enum("content", {
				locked: true,
			}),
			logoUrl: figma.enum("content", {
				logo: "https://example.com/flavor-logo.svg",
			}),
		},
		example: ({ permissionDenied, logoUrl }) => (
			<StackComponentHeaderChip
				component={{
					name: "vertex-ai",
					type: "orchestrator",
					flavorName: "vertex-ai",
					permissionDenied,
					logoUrl,
				}}
			/>
		),
	}
);
