import figma from "@figma/code-connect";

import { Breadcrumbs } from "./Breadcrumbs";

// Map-to-existing: Breadcrumbs is a data-driven wrapper that renders the
// shadcn Breadcrumb primitive with identical visual output, so it points at
// the existing Breadcrumb (primitive) page instead of a new build.
figma.connect(
	Breadcrumbs,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=85-5",
	{
		props: {
			crumb1: figma.string("Crumb 1"),
			crumb2: figma.string("Crumb 2"),
			page: figma.string("Current page"),
		},
		example: ({ crumb1, crumb2, page }) => (
			<Breadcrumbs
				items={[
					{ key: "org", label: crumb1 },
					{ key: "workspace", label: crumb2 },
					{ key: "current", label: page, isCurrent: true },
				]}
			/>
		),
	}
);
