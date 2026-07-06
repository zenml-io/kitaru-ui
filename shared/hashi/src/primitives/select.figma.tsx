import figma from "@figma/code-connect";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";

figma.connect(
	SelectTrigger,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=82-29",
	{
		props: {
			size: figma.enum("size", { sm: "sm" }),
			disabled: figma.enum("state", { disabled: true }),
			value: figma.string("Value"),
		},
		example: ({ size, disabled, value }) => (
			<Select>
				<SelectTrigger size={size} disabled={disabled}>
					<SelectValue placeholder={value} />
				</SelectTrigger>
				<SelectContent>…</SelectContent>
			</Select>
		),
	}
);

figma.connect(
	SelectContent,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=83-8",
	{
		// Static open-listbox reference — item rows are content, not Figma props.
		example: () => (
			<SelectContent>
				<SelectItem value="a">Option A</SelectItem>
				<SelectItem value="b">Option B</SelectItem>
			</SelectContent>
		),
	}
);
