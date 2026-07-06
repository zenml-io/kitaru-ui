import figma from "@figma/code-connect";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./empty";

figma.connect(
	Empty,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=86-5",
	{
		props: {
			title: figma.string("Title"),
			description: figma.string("Description"),
			icon: figma.instance("Icon"),
		},
		example: ({ title, description, icon }) => (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">{icon}</EmptyMedia>
					<EmptyTitle>{title}</EmptyTitle>
					<EmptyDescription>{description}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		),
	}
);
