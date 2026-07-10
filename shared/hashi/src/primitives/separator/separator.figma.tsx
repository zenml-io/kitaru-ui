import figma from "@figma/code-connect";

import { Separator } from "./separator";

figma.connect(
	Separator,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=72-7",
	{
		props: {
			orientation: figma.enum("orientation", { vertical: "vertical" }),
		},
		example: ({ orientation }) => <Separator orientation={orientation} />,
	}
);
