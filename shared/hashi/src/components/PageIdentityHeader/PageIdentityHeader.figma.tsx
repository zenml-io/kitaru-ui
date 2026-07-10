import figma from "@figma/code-connect";

import { Avatar, AvatarFallback } from "../../primitives/avatar/avatar";
import { Badge } from "@zenml/hashi/primitives/badge";
import { Button } from "@zenml/hashi/primitives/button";

import { PageIdentityHeader } from "./PageIdentityHeader";

// context=org/project/workspace variants are connected by the composed bands
// (OrgIdentityBand, ProjectIdentityBandView, WorkspaceIdentityBand); this
// connect covers the raw generic shell.
figma.connect(
	PageIdentityHeader,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=288-1091",
	{
		variant: { context: "generic" },
		props: {
			title: figma.enum("config", {
				default: "production-traces",
				"with-meta": "zenml-eu-central",
				"with-actions": "production-traces",
				"no-pretitle": "data-validation",
			}),
			pretitle: figma.enum("config", {
				default: "Project",
				"with-meta": "Workspace",
				"with-actions": "Project",
			}),
			meta: figma.enum("config", {
				"with-meta": (
					<span className="flex items-center gap-3">
						<Badge variant="secondary">ZenML 0.68.1</Badge>
						<span className="text-muted-foreground text-xs">Production</span>
					</span>
				),
			}),
			actions: figma.enum("config", {
				"with-actions": (
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm">
							Settings
						</Button>
						<Button size="sm">New pipeline</Button>
					</div>
				),
			}),
		},
		example: ({ title, pretitle, meta, actions }) => (
			<PageIdentityHeader
				avatar={
					<Avatar shape="square" size="xl" aria-label="production-traces">
						<AvatarFallback className="bg-muted text-muted-foreground" />
					</Avatar>
				}
				pretitle={pretitle}
				title={title}
				meta={meta}
				actions={actions}
			/>
		),
	}
);
