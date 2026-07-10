import figma from "@figma/code-connect";

import { Button } from "../button/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./dialog";

// The Figma set draws only the static content surface; the backdrop, portal,
// and open/close behavior are runtime-only. The corner close button is the
// only structural variant.
figma.connect(
	DialogContent,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=365-33",
	{
		props: {
			showCloseButton: figma.boolean("showCloseButton"),
		},
		example: ({ showCloseButton }) => (
			<Dialog>
				<DialogContent showCloseButton={showCloseButton}>
					<DialogHeader>
						<DialogTitle>Re-run pipeline</DialogTitle>
						<DialogDescription>
							Re-runs feature_pipeline with the current configuration on
							zenml-eu-central.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose render={<Button variant="outline" />}>
							Cancel
						</DialogClose>
						<Button>Re-run</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		),
	}
);
