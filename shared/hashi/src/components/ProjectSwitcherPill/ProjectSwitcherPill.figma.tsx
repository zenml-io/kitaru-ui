import figma from "@figma/code-connect";

import { ProjectSwitcherPillView } from "./ProjectSwitcherPill";

// ProjectSwitcherPill has no separate Figma set — it is the context=project
// family of the shared SwitcherRow set (name-only row).
figma.connect(
	ProjectSwitcherPillView,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-507",
	{
		variant: { context: "project" },
		example: () => (
			<ProjectSwitcherPillView
				items={[{ slug: "production-traces", name: "production-traces" }]}
				selected={{ slug: "production-traces", name: "production-traces" }}
				labelRender={<a href="#" />}
				onSelectProject={() => {}}
				onOpenAllProjects={() => {}}
			/>
		),
	}
);
