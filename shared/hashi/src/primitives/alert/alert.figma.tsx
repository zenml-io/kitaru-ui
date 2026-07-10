import figma from "@figma/code-connect";

import { Alert, AlertDescription, AlertTitle } from "./alert";

const handleDismiss = () => {};

figma.connect(
	Alert,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=380-1666",
	{
		props: {
			variant: figma.enum("variant", {
				neutral: "neutral",
				info: "info",
				success: "success",
				warning: "warning",
				destructive: "destructive",
			}),
			emphasis: figma.enum("emphasis", {
				bold: "bold",
			}),
			shape: figma.enum("shape", {
				banner: "banner",
			}),
			title: figma.string("Title"),
			description: figma.boolean("Show description", {
				true: figma.string("Description"),
				false: undefined,
			}),
			action: figma.boolean("Show action", {
				true: figma.instance("Action"),
				false: undefined,
			}),
			onDismiss: figma.boolean("Dismissible", {
				true: handleDismiss,
				false: undefined,
			}),
		},
		example: ({
			variant,
			emphasis,
			shape,
			title,
			description,
			action,
			onDismiss,
		}) => (
			<Alert
				variant={variant}
				emphasis={emphasis}
				shape={shape}
				action={action}
				onDismiss={onDismiss}
			>
				<AlertTitle>{title}</AlertTitle>
				<AlertDescription>{description}</AlertDescription>
			</Alert>
		),
	}
);
