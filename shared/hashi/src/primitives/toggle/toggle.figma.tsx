import figma from "@figma/code-connect";

import { Toggle } from "./toggle";

figma.connect(
	Toggle,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=71-20",
	{
		props: {
			variant: figma.enum("variant", {
				outline: "outline",
				pill: "pill",
			}),
			size: figma.enum("size", {
				sm: "sm",
				lg: "lg",
			}),
			pressed: figma.enum("pressed", { true: true }),
			icon: figma.instance("Icon"),
		},
		example: ({ variant, size, pressed, icon }) => (
			<Toggle
				aria-label="Toggle"
				variant={variant}
				size={size}
				defaultPressed={pressed}
			>
				{icon}
			</Toggle>
		),
	}
);
