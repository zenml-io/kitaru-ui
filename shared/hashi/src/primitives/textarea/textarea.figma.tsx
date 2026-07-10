import figma from "@figma/code-connect";

import { Textarea } from "./textarea";

figma.connect(
	Textarea,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=252-13",
	{
		props: {
			disabled: figma.enum("state", {
				disabled: true,
			}),
			invalid: figma.enum("state", {
				invalid: true,
			}),
		},
		example: ({ disabled, invalid }) => (
			<Textarea
				placeholder="Describe what changed in this run..."
				disabled={disabled}
				aria-invalid={invalid}
			/>
		),
	}
);
