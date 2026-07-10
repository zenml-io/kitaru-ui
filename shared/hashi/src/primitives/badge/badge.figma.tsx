import figma from "@figma/code-connect";

import { Badge } from "./badge";

figma.connect(
	Badge,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=61-11",
	{
		props: {
			label: figma.string("Label"),
			variant: figma.enum("variant", {
				secondary: "secondary",
				destructive: "destructive",
				outline: "outline",
				ghost: "ghost",
				link: "link",
				success: "success",
				warning: "warning",
				info: "info",
				teal: "teal",
				neutral: "neutral",
				archived: "archived",
			}),
			emphasis: figma.enum("emphasis", {
				light: "light",
				neutral: "neutral",
				ghost: "ghost",
			}),
			radius: figma.enum("radius", {
				sm: "sm",
			}),
			size: figma.enum("size", {
				xs: "xs",
			}),
			icon: figma.boolean("Show icon", {
				true: figma.instance("Icon"),
				false: undefined,
			}),
		},
		example: ({ label, variant, emphasis, radius, size, icon }) => (
			<Badge
				variant={variant}
				emphasis={emphasis}
				radius={radius}
				size={size}
			>
				{icon}
				{label}
			</Badge>
		),
	}
);
