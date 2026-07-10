import figma from "@figma/code-connect";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "./sheet";

// The Figma set draws only the static content surface; the backdrop, portal,
// and slide animation are runtime-only. right/left are full-height max-w-sm
// panels; top/bottom span the viewport width and hug their content.
figma.connect(
	SheetContent,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=366-1266",
	{
		props: {
			side: figma.enum("side", {
				right: "right",
				left: "left",
				top: "top",
				bottom: "bottom",
			}),
			showCloseButton: figma.boolean("showCloseButton"),
		},
		example: ({ side, showCloseButton }) => (
			<Sheet>
				<SheetContent side={side} showCloseButton={showCloseButton}>
					<SheetHeader>
						<SheetTitle>Run #142 — research_agent</SheetTitle>
						<SheetDescription>
							Completed in 3.2s · $0.0234 · 2,481 tokens
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		),
	}
);
