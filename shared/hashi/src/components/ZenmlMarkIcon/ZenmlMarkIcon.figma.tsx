import figma from "@figma/code-connect";

import { ZenmlMarkIcon } from "./ZenmlMarkIcon";

figma.connect(
	ZenmlMarkIcon,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=241-7",
	{
		example: () => <ZenmlMarkIcon className="size-7" />,
	}
);
