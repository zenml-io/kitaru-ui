import figma from "@figma/code-connect";

import { KitaruMarkIcon } from "./KitaruMarkIcon";

figma.connect(
	KitaruMarkIcon,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=241-13",
	{
		example: () => <KitaruMarkIcon className="size-7" />,
	}
);
