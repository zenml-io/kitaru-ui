import figma from "@figma/code-connect";

import { Switch } from "./switch";

figma.connect(
	Switch,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=69-13",
	{
		props: {
			checked: figma.enum("checked", { true: true }),
			size: figma.enum("size", { sm: "sm" }),
		},
		example: ({ checked, size }) => (
			<Switch size={size} defaultChecked={checked} />
		),
	}
);
