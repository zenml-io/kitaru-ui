import figma from "@figma/code-connect";

import { Badge } from "@zenml/hashi/primitives/badge";
import { DropdownMenuItem } from "@zenml/hashi/primitives/dropdown-menu";

import { SwitcherDropdownMenu } from "./SwitcherDropdownMenu";
import { SwitcherEmpty, SwitcherRow } from "../SwitcherPill/SwitcherPill";

figma.connect(
	SwitcherDropdownMenu,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=284-652",
	{
		props: {
			headerExtras: figma.enum("headerExtras", {
				badge: (
					<Badge variant="secondary" className="shrink-0">
						Newest
					</Badge>
				),
			}),
			footer: figma.enum("footer", {
				action: (
					<DropdownMenuItem
						onClick={() => {}}
						className="text-muted-foreground m-1 flex items-center gap-2.5 py-1.5"
					>
						<span className="text-sm">View all deployments</span>
					</DropdownMenuItem>
				),
				counter: (
					<p className="text-2xs text-muted-foreground px-3 py-2 tabular-nums">
						Showing 3 of 4
					</p>
				),
			}),
			rows: figma.enum("content", {
				populated: (
					<SwitcherRow active onSelect={() => {}}>
						<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
							zenml-eu-central
						</span>
					</SwitcherRow>
				),
				empty: <SwitcherEmpty noun="workspaces" query="staging" />,
			}),
		},
		example: ({ headerExtras, footer, rows }) => (
			<SwitcherDropdownMenu
				contextLabel="Workspaces"
				headerExtras={headerExtras}
				footer={footer}
			>
				{({ query }) => rows}
			</SwitcherDropdownMenu>
		),
	}
);
