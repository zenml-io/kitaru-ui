import figma from "@figma/code-connect";

import { OrgMark } from "./OrgMark";

// Map-to-existing: OrgMark is a thin wrapper over Avatar (shape=square, an
// image, and a bg-primary fallback), so it points at the existing Avatar set
// instead of a new build. Restricted to the square shape; sm and xl are the
// only sizes the wrapper accepts.
figma.connect(
	OrgMark,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=75-2",
	{
		variant: { shape: "square" },
		props: {
			size: figma.enum("size", {
				sm: "sm",
				xl: "xl",
			}),
		},
		example: ({ size }) => (
			<OrgMark name="ZenML" imageSrc="/org-mark.png" size={size} />
		),
	}
);
