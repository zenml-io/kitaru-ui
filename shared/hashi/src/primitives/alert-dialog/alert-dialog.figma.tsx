import figma from "@figma/code-connect";
import { TriangleAlert } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "./alert-dialog";

// The Figma set draws only the static content surface; the backdrop, portal,
// and open/close behavior are runtime-only. size=sm centers the text and
// switches the footer to a two-column grid on its own.
figma.connect(
	AlertDialogContent,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=360-1237",
	{
		props: {
			size: figma.enum("size", {
				default: "default",
				sm: "sm",
			}),
			media: figma.boolean("hasMedia", {
				true: (
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<TriangleAlert />
					</AlertDialogMedia>
				),
				false: undefined,
			}),
		},
		example: ({ size, media }) => (
			<AlertDialog>
				<AlertDialogContent size={size}>
					<AlertDialogHeader>
						{media}
						<AlertDialogTitle>Delete 3 secrets?</AlertDialogTitle>
						<AlertDialogDescription>
							These secrets are referenced by 2 active deployments. This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction variant="destructive">
							Delete secrets
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		),
	}
);
