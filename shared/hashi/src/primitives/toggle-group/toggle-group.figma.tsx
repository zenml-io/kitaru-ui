import figma from "@figma/code-connect";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

figma.connect(
	ToggleGroup,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=253-488",
	{
		props: {
			// Code defaults ("default") omitted from both maps.
			variant: figma.enum("variant", {
				outline: "outline",
				pill: "pill",
			}),
			size: figma.enum("size", {
				sm: "sm",
				lg: "lg",
			}),
		},
		example: ({ variant, size }) => (
			<ToggleGroup
				variant={variant}
				size={size}
				value="timeline"
				onValueChange={() => {}}
			>
				<ToggleGroupItem value="tree">Tree</ToggleGroupItem>
				<ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
				<ToggleGroupItem value="logs">Logs</ToggleGroupItem>
			</ToggleGroup>
		),
	}
);
