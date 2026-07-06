import figma from "@figma/code-connect";

import { Checkbox } from "./checkbox";

figma.connect(
	Checkbox,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=68-11",
	{
		props: {
			checked: figma.enum("checked", { true: true }),
		},
		example: ({ checked }) => <Checkbox defaultChecked={checked} />,
	}
);
