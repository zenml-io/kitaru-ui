import figma from "@figma/code-connect";

import { CopyButton } from "./CopyButton";

// Map-to-existing: CopyButton is a pure behavioral wrapper over IconButton
// (Copy icon idle, Check icon after a copy), so it points at the existing
// IconButton node instead of a new build. The copied state is the same
// IconButton with an icon swap at runtime.
figma.connect(
	CopyButton,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=65-26",
	{
		props: {
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
		example: ({ variant, size }) => (
			<CopyButton text="zenml-eu-central" variant={variant} size={size} />
		),
	}
);
