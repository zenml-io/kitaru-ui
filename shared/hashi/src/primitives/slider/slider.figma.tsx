import figma from "@figma/code-connect";

import { Slider } from "./slider";

figma.connect(
	Slider,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=251-13",
	{
		props: {
			disabled: figma.enum("state", {
				disabled: true,
			}),
		},
		example: ({ disabled }) => (
			<Slider
				value={0.7}
				onValueChange={() => {}}
				disabled={disabled}
				aria-label="Temperature"
			/>
		),
	}
);
