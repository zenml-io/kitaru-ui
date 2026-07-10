import figma from "@figma/code-connect";

import { KitaruLogo } from "./KitaruLogo";

figma.connect(
	KitaruLogo,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=243-14",
	{
		example: () => <KitaruLogo />,
	}
);
