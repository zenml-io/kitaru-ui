import figma from "@figma/code-connect";

import { ZenmlLogo } from "./ZenmlLogo";

figma.connect(
	ZenmlLogo,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=242-17",
	{
		example: () => <ZenmlLogo />,
	}
);
