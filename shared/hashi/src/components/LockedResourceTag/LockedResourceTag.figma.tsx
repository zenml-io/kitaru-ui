import figma from "@figma/code-connect";

import { LockedResourceTag } from "./LockedResourceTag";

figma.connect(
	LockedResourceTag,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=254-17",
	{
		example: () => <LockedResourceTag name="gcp-artifact-store" />,
	}
);
