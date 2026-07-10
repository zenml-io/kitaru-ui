import figma from "@figma/code-connect";

import { OrgIdentityBand } from "./OrgIdentityBand";

// The context=org variant of the shared PageIdentityHeader set.
figma.connect(
	OrgIdentityBand,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=288-1091",
	{
		variant: { context: "org" },
		example: () => (
			<OrgIdentityBand
				name="ZenML"
				workspaceCount={6}
				projectCount={24}
				memberCount={48}
			/>
		),
	}
);
