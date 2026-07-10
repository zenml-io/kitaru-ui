import figma from "@figma/code-connect";

import { DebouncedInput } from "./DebouncedInput";

// Map-to-existing: DebouncedInput returns exactly one Input with debounce
// behavior layered on top (no visual delta), so it points at the existing
// Input node instead of a new build.
figma.connect(
	DebouncedInput,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=66-11",
	{
		props: {
			placeholder: figma.string("Placeholder"),
			disabled: figma.enum("state", { disabled: true }),
		},
		example: ({ placeholder, disabled }) => (
			<DebouncedInput
				value={query}
				placeholder={placeholder}
				disabled={disabled}
				debounceMs={300}
				onDebouncedValueChange={() => {}}
			/>
		),
	}
);
