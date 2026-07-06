import figma from "@figma/code-connect";

import { IconButton } from "./icon-button";

figma.connect(
	IconButton,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=65-26",
	{
		props: {
			icon: figma.instance("Icon"),
			// Code defaults (ghost / icon-sm) omitted so the snippet drops them.
			variant: figma.enum("variant", {
				default: "default",
				destructive: "destructive",
				outline: "outline",
				secondary: "secondary",
				link: "link",
			}),
			size: figma.enum("size", {
				"icon-xs": "icon-xs",
				icon: "icon",
				"icon-lg": "icon-lg",
			}),
		},
		example: ({ icon, variant, size }) => (
			<IconButton icon={icon} label="Label" variant={variant} size={size} />
		),
	}
);
