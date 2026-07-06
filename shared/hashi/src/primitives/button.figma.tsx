import figma from "@figma/code-connect";

import { Button } from "./button";

figma.connect(
	Button,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=46-2",
	{
		props: {
			label: figma.string("Label"),
			// Code defaults omitted from the enum map so the snippet drops them.
			variant: figma.enum("variant", {
				destructive: "destructive",
				outline: "outline",
				secondary: "secondary",
				ghost: "ghost",
				link: "link",
			}),
			size: figma.enum("size", {
				xs: "xs",
				sm: "sm",
				lg: "lg",
			}),
			icon: figma.boolean("Show icon", {
				true: figma.instance("Icon"),
				false: undefined,
			}),
		},
		example: ({ label, variant, size, icon }) => (
			<Button variant={variant} size={size}>
				{icon}
				{label}
			</Button>
		),
	}
);
