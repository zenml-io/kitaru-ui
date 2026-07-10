import figma from "@figma/code-connect";
import { ArrowLeftRight, Play, RefreshCcw } from "lucide-react";

import { Button } from "@zenml/hashi/primitives/button";

import { TabsBar } from "./TabsBar";

figma.connect(
	TabsBar,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=299-2",
	{
		props: {
			surface: figma.enum("surface", {
				page: "page",
				panel: "panel",
			}),
			lastTab: figma.boolean("badge", {
				true: { value: "executions", label: "Executions", badge: 142 },
				false: { value: "diff", label: "Diff" },
			}),
			actions: figma.enum("actions", {
				single: (
					<Button size="sm" className="gap-1.5">
						<Play className="size-3.5 fill-current" aria-hidden />
						Invoke
					</Button>
				),
				multi: (
					<span className="contents">
						<Button variant="outline" size="sm">
							<RefreshCcw className="size-3.5" aria-hidden />
							Replay
						</Button>
						<Button variant="outline" size="sm">
							<ArrowLeftRight className="size-3.5" aria-hidden />
							Compare
						</Button>
					</span>
				),
			}),
		},
		example: ({ surface, lastTab, actions }) => (
			<TabsBar
				surface={surface}
				tabs={[
					{ value: "overview", label: "Overview" },
					{ value: "execution", label: "Execution" },
					{ value: "logs", label: "Logs" },
					{ value: "cost", label: "Cost" },
					lastTab,
				]}
				activeTab="overview"
				onTabChange={() => {}}
				actions={actions}
			/>
		),
	}
);
