import figma from "@figma/code-connect";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./card";

figma.connect(
	Card,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=80-5",
	{
		props: {
			title: figma.string("Title"),
			description: figma.string("Description"),
		},
		example: ({ title, description }) => (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>…</CardContent>
			</Card>
		),
	}
);
