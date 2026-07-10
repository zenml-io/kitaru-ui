import figma from "@figma/code-connect";

import { WorkspaceSwitcherPillView } from "./WorkspaceSwitcherPill";

// WorkspaceSwitcherPill has no separate Figma set — it is the
// context=workspace family of the shared SwitcherRow set (name + mono version
// Badge). The dropdown groups rows into ZenML / Kitaru sections with a
// back-to-organization footer.
figma.connect(
	WorkspaceSwitcherPillView,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-507",
	{
		variant: { context: "workspace" },
		example: () => (
			<WorkspaceSwitcherPillView
				items={[
					{
						name: "zenml-eu-central",
						slug: "zenml-eu-central",
						type: "zenml",
						version: "0.68.1",
					},
				]}
				selected={{
					name: "zenml-eu-central",
					slug: "zenml-eu-central",
					type: "zenml",
					version: "0.68.1",
				}}
				labelRender={<a href="#" />}
				onSelectWorkspace={() => {}}
				onBackToOrganization={() => {}}
			/>
		),
	}
);
