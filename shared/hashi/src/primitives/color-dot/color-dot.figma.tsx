import figma from "@figma/code-connect";

import { ColorDot } from "./color-dot";

figma.connect(
	ColorDot,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=76-11",
	{
		props: {
			shape: figma.enum("shape", { round: "round" }),
			size: figma.enum("size", { xs: "xs", md: "md" }),
		},
		// Color comes from className in code (bg-primary, bg-success, …).
		example: ({ shape, size }) => (
			<ColorDot shape={shape} size={size} className="bg-primary" />
		),
	}
);
