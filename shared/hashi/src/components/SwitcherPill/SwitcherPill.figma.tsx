import figma from "@figma/code-connect";
import { GitBranch } from "lucide-react";

import { Badge } from "@zenml/hashi/primitives/badge";

import { SwitcherEmpty, SwitcherPill, SwitcherRow } from "./SwitcherPill";
import { SwitcherDropdownMenu } from "../SwitcherDropdownMenu/SwitcherDropdownMenu";

figma.connect(
	SwitcherPill,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-506",
	{
		props: {
			// static pills omit labelRender and fall back to a non-navigable <div>
			labelRender: figma.enum("labelVariant", {
				linked: <a href="#" />,
			}),
			label: figma.enum("labelContent", {
				text: <span className="max-w-44 truncate">zenml-eu-central</span>,
				rich: (
					<span className="flex items-center gap-1.5">
						<GitBranch className="text-muted-foreground size-3.5" aria-hidden />
						<span className="max-w-44 truncate">customer-churn-prediction</span>
						<Badge
							variant="outline"
							className="text-2xs h-4 shrink-0 px-1.5 font-mono"
						>
							v12
						</Badge>
					</span>
				),
			}),
		},
		example: ({ labelRender, label }) => (
			<SwitcherPill
				labelRender={labelRender}
				labelAriaLabel="Go to workspace zenml-eu-central"
				triggerAriaLabel="Switch workspace. Current: zenml-eu-central"
				label={label}
			>
				<SwitcherDropdownMenu contextLabel="Workspaces">
					{({ query }) => (
						<SwitcherRow active onSelect={() => {}}>
							<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
								zenml-eu-central
							</span>
						</SwitcherRow>
					)}
				</SwitcherDropdownMenu>
			</SwitcherPill>
		),
	}
);

figma.connect(
	SwitcherRow,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-507",
	{
		props: {
			active: figma.enum("state", {
				active: true,
				inactive: false,
			}),
		},
		example: ({ active }) => (
			<SwitcherRow active={active} onSelect={() => {}}>
				<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
					zenml-eu-central
				</span>
			</SwitcherRow>
		),
	}
);

figma.connect(
	SwitcherEmpty,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-504",
	{
		example: () => <SwitcherEmpty noun="workspaces" query="staging" />,
	}
);
