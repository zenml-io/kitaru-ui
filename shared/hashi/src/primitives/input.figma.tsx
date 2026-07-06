import figma from "@figma/code-connect";

import { Input } from "./input";

figma.connect(
	Input,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=66-11",
	{
		props: {
			placeholder: figma.string("Placeholder"),
			disabled: figma.enum("state", { disabled: true }),
			invalid: figma.enum("state", { invalid: true }),
		},
		example: ({ placeholder, disabled, invalid }) => (
			<Input placeholder={placeholder} disabled={disabled} aria-invalid={invalid} />
		),
	}
);
