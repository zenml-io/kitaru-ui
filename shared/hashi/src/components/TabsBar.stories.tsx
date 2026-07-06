import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Play, RefreshCcw, ArrowLeftRight, Download } from "lucide-react";

import { TabsBar, type TabsBarItem } from "./TabsBar";

// ---------------------------------------------------------------------------
// Storybook does not expose Button from hashi primitives at the meta level,
// so we import it directly for the action slot examples.
// ---------------------------------------------------------------------------
import { Button } from "../primitives/button";

const meta: Meta<typeof TabsBar> = {
	title: "Components/TabsBar",
	component: TabsBar,
	args: {
		surface: "panel",
		sticky: false,
		activeTab: "overview",
	},
	argTypes: {
		surface: {
			control: "select",
			options: ["page", "panel"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof TabsBar>;

// ---------------------------------------------------------------------------
// Shared fixture data
// ---------------------------------------------------------------------------

const flowTabs: TabsBarItem[] = [
	{ value: "overview", label: "Overview" },
	{ value: "playground", label: "Playground" },
	{ value: "logs", label: "Logs" },
	{ value: "auth", label: "Auth" },
	{ value: "executions", label: "Executions", badge: 142 },
];

const executionTabs: TabsBarItem[] = [
	{ value: "overview", label: "Overview" },
	{ value: "execution", label: "Execution" },
	{ value: "logs", label: "Logs" },
	{ value: "cost", label: "Cost" },
	{ value: "diff", label: "Diff" },
];

const artifactTabs: TabsBarItem[] = [
	{ value: "metadata", label: "Metadata" },
	{ value: "lineage", label: "Lineage" },
	{ value: "versions", label: "Versions", badge: 8 },
];

// ---------------------------------------------------------------------------
// Default — args-driven playground
// ---------------------------------------------------------------------------

export const Default: Story = {
	args: {
		tabs: flowTabs,
		activeTab: "overview",
	},
	render: (args) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [active, setActive] = useState(args.activeTab ?? "overview");
		return (
			<div className="border-border overflow-hidden rounded-lg border">
				<TabsBar
					{...args}
					tabs={flowTabs}
					activeTab={active}
					onTabChange={setActive}
				/>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export const Surfaces: Story = {
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [active, setActive] = useState("overview");
		return (
			<div className="flex flex-col gap-8">
				<div>
					<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
						surface="page" — layout chrome, full-bleed bg-card
					</p>
					<div className="border-border overflow-hidden rounded-lg border">
						<TabsBar
							surface="page"
							tabs={flowTabs}
							activeTab={active}
							onTabChange={setActive}
							sticky={false}
						/>
					</div>
				</div>

				<div>
					<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
						surface="panel" — scoped content panel, bg-secondary
					</p>
					<div className="border-border overflow-hidden rounded-lg border">
						<TabsBar
							surface="panel"
							tabs={flowTabs}
							activeTab={active}
							onTabChange={setActive}
							sticky={false}
						/>
					</div>
				</div>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// WithBadge
// ---------------------------------------------------------------------------

export const WithBadge: Story = {
	name: "With Badge",
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [active, setActive] = useState("executions");
		return (
			<div className="border-border overflow-hidden rounded-lg border">
				<TabsBar
					surface="panel"
					tabs={flowTabs}
					activeTab={active}
					onTabChange={setActive}
					sticky={false}
				/>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// WithActions
// ---------------------------------------------------------------------------

export const WithActions: Story = {
	name: "With Actions",
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [flowActive, setFlowActive] = useState("overview");
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [execActive, setExecActive] = useState("execution");
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [artifactActive, setArtifactActive] = useState("metadata");

		return (
			<div className="flex flex-col gap-8">
				<div>
					<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
						Flow page — single action
					</p>
					<div className="border-border overflow-hidden rounded-lg border">
						<TabsBar
							surface="panel"
							tabs={flowTabs}
							activeTab={flowActive}
							onTabChange={setFlowActive}
							sticky={false}
							actions={
								<Button size="sm" className="gap-1.5">
									<Play className="size-3.5 fill-current" aria-hidden />
									Invoke
								</Button>
							}
						/>
					</div>
				</div>

				<div>
					<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
						Execution page — multiple actions
					</p>
					<div className="border-border overflow-hidden rounded-lg border">
						<TabsBar
							surface="panel"
							tabs={executionTabs}
							activeTab={execActive}
							onTabChange={setExecActive}
							sticky={false}
							actions={
								<>
									<Button variant="outline" size="sm">
										<RefreshCcw className="size-3.5" aria-hidden />
										Replay
									</Button>
									<Button variant="outline" size="sm">
										<ArrowLeftRight className="size-3.5" aria-hidden />
										Compare
									</Button>
								</>
							}
						/>
					</div>
				</div>

				<div>
					<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
						Artifact page — icon-only action
					</p>
					<div className="border-border overflow-hidden rounded-lg border">
						<TabsBar
							surface="panel"
							tabs={artifactTabs}
							activeTab={artifactActive}
							onTabChange={setArtifactActive}
							sticky={false}
							actions={
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Download artifact"
								>
									<Download className="size-4" aria-hidden />
								</Button>
							}
						/>
					</div>
				</div>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// NoActions
// ---------------------------------------------------------------------------

export const NoActions: Story = {
	name: "No Actions",
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [active, setActive] = useState("overview");
		return (
			<div className="border-border overflow-hidden rounded-lg border">
				<TabsBar
					surface="panel"
					tabs={flowTabs}
					activeTab={active}
					onTabChange={setActive}
					sticky={false}
				/>
			</div>
		);
	},
};

// ---------------------------------------------------------------------------
// Composed — realistic page shell
// ---------------------------------------------------------------------------

export const Composed: Story = {
	name: "Composed — Page Shell",
	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [active, setActive] = useState("execution");
		return (
			<div className="bg-background min-h-48 overflow-hidden rounded-lg border">
				<TabsBar
					surface="page"
					tabs={executionTabs}
					activeTab={active}
					onTabChange={setActive}
					sticky={false}
					actions={
						<>
							<Button variant="outline" size="sm">
								<RefreshCcw className="size-3.5" aria-hidden />
								Replay
							</Button>
							<Button variant="outline" size="sm">
								<ArrowLeftRight className="size-3.5" aria-hidden />
								Compare
							</Button>
						</>
					}
				/>
				<div className="text-muted-foreground px-8 py-6 text-sm">
					Active tab: <strong className="text-foreground">{active}</strong>
				</div>
			</div>
		);
	},
};
