import figma from "@figma/code-connect";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

figma.connect(
	Tooltip,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=79-5",
	{
		props: {
			text: figma.string("Text"),
		},
		example: ({ text }) => (
			<Tooltip>
				<TooltipTrigger>Hover</TooltipTrigger>
				<TooltipContent>{text}</TooltipContent>
			</Tooltip>
		),
	}
);
