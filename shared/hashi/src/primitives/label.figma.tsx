import figma from "@figma/code-connect";

import { Label } from "./label";

figma.connect(
	Label,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=67-9",
	{
		props: {
			text: figma.string("Text"),
		},
		// state=disabled is context-driven in code (group-data/peer-disabled),
		// not a Label prop — intentionally not emitted.
		example: ({ text }) => <Label>{text}</Label>,
	}
);
