import figma from "@figma/code-connect";

import { Avatar, AvatarFallback } from "./avatar";

figma.connect(
	Avatar,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=75-2",
	{
		props: {
			size: figma.enum("size", {
				sm: "sm",
				lg: "lg",
				xl: "xl",
				"2xl": "2xl",
			}),
			shape: figma.enum("shape", { square: "square" }),
			initials: figma.string("Initials"),
		},
		example: ({ size, shape, initials }) => (
			<Avatar size={size} shape={shape}>
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
		),
	}
);
