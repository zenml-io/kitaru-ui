import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	CodeXml,
	FileText,
	Info,
	LayoutDashboard,
	Settings,
	Terminal,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta<typeof Tabs> = {
	title: "Primitives/Tabs",
	component: Tabs,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=81-22",
		},
	},
	args: {
		defaultValue: "overview",
		orientation: "horizontal",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ---------------------------------------------------------------------------
// Default — driven by args so the controls panel works
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: (args) => (
		<Tabs {...args}>
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="diff">Diff</TabsTrigger>
				<TabsTrigger value="logs">Logs</TabsTrigger>
				<TabsTrigger value="cost">Cost</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Overview content — DAG visualization would go here.
				</p>
			</TabsContent>
			<TabsContent value="diff" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Diff content — run comparison would go here.
				</p>
			</TabsContent>
			<TabsContent value="logs" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Logs content — structured log entries would go here.
				</p>
			</TabsContent>
			<TabsContent value="cost" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Cost content — token and compute breakdown would go here.
				</p>
			</TabsContent>
		</Tabs>
	),
};

// ---------------------------------------------------------------------------
// ListVariants — default (pill) vs line (underline)
// ---------------------------------------------------------------------------

export const ListVariants: Story = {
	render: () => (
		<div className="space-y-8">
			<div>
				<p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
					default (pill)
				</p>
				<Tabs defaultValue="overview">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="runs">Runs</TabsTrigger>
						<TabsTrigger value="artifacts">Artifacts</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>
					<TabsContent value="overview" className="mt-4">
						<p className="text-muted-foreground text-sm">Overview content.</p>
					</TabsContent>
					<TabsContent value="runs" className="mt-4">
						<p className="text-muted-foreground text-sm">Runs content.</p>
					</TabsContent>
					<TabsContent value="artifacts" className="mt-4">
						<p className="text-muted-foreground text-sm">Artifacts content.</p>
					</TabsContent>
					<TabsContent value="settings" className="mt-4">
						<p className="text-muted-foreground text-sm">Settings content.</p>
					</TabsContent>
				</Tabs>
			</div>

			<div>
				<p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
					line (underline indicator)
				</p>
				<Tabs defaultValue="overview">
					<TabsList variant="line" className="border-border border-b">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="runs">Runs</TabsTrigger>
						<TabsTrigger value="artifacts">Artifacts</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>
					<TabsContent value="overview" className="mt-4">
						<p className="text-muted-foreground text-sm">Overview content.</p>
					</TabsContent>
					<TabsContent value="runs" className="mt-4">
						<p className="text-muted-foreground text-sm">Runs content.</p>
					</TabsContent>
					<TabsContent value="artifacts" className="mt-4">
						<p className="text-muted-foreground text-sm">Artifacts content.</p>
					</TabsContent>
					<TabsContent value="settings" className="mt-4">
						<p className="text-muted-foreground text-sm">Settings content.</p>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	),
};

// ---------------------------------------------------------------------------
// WithIcons — line variant with leading lucide icons (execution detail pattern)
// ---------------------------------------------------------------------------

export const WithIcons: Story = {
	render: () => (
		<Tabs defaultValue="overview">
			<TabsList variant="line" className="border-border border-b">
				<TabsTrigger value="overview">
					<Info />
					Overview
				</TabsTrigger>
				<TabsTrigger value="code">
					<CodeXml />
					Code &amp; Config
				</TabsTrigger>
				<TabsTrigger value="logs">
					<FileText />
					Logs
				</TabsTrigger>
				<TabsTrigger value="terminal">
					<Terminal />
					Terminal
				</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Step overview — input/output artifacts and metadata would appear here.
				</p>
			</TabsContent>
			<TabsContent value="code" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Source code and runtime configuration.
				</p>
			</TabsContent>
			<TabsContent value="logs" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Structured log output from the step.
				</p>
			</TabsContent>
			<TabsContent value="terminal" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Raw terminal output stream.
				</p>
			</TabsContent>
		</Tabs>
	),
};

// ---------------------------------------------------------------------------
// DisabledTrigger — one tab locked (e.g. feature not yet available)
// ---------------------------------------------------------------------------

export const DisabledTrigger: Story = {
	render: () => (
		<Tabs defaultValue="traces">
			<TabsList variant="line" className="border-border border-b">
				<TabsTrigger value="traces">Traces</TabsTrigger>
				<TabsTrigger value="metrics">Metrics</TabsTrigger>
				<TabsTrigger value="alerts">Alerts</TabsTrigger>
				<TabsTrigger value="settings" disabled>
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent value="traces" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Production traces for the zenml-eu-central workspace.
				</p>
			</TabsContent>
			<TabsContent value="metrics" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Aggregated pipeline metrics.
				</p>
			</TabsContent>
			<TabsContent value="alerts" className="mt-4">
				<p className="text-muted-foreground text-sm">
					Configured alert rules and history.
				</p>
			</TabsContent>
		</Tabs>
	),
};

// ---------------------------------------------------------------------------
// Vertical — sidebar-style navigation orientation
// ---------------------------------------------------------------------------

export const Vertical: Story = {
	render: () => (
		<Tabs orientation="vertical" defaultValue="general" className="min-h-48">
			<TabsList className="w-40">
				<TabsTrigger value="general">
					<LayoutDashboard />
					General
				</TabsTrigger>
				<TabsTrigger value="integrations">
					<CodeXml />
					Integrations
				</TabsTrigger>
				<TabsTrigger value="logs">
					<FileText />
					Logs
				</TabsTrigger>
				<TabsTrigger value="settings">
					<Settings />
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent value="general" className="p-4">
				<p className="text-muted-foreground text-sm">
					General workspace settings for zenml-eu-central.
				</p>
			</TabsContent>
			<TabsContent value="integrations" className="p-4">
				<p className="text-muted-foreground text-sm">
					Connected integrations and credentials.
				</p>
			</TabsContent>
			<TabsContent value="logs" className="p-4">
				<p className="text-muted-foreground text-sm">
					Audit logs for this workspace.
				</p>
			</TabsContent>
			<TabsContent value="settings" className="p-4">
				<p className="text-muted-foreground text-sm">
					Advanced configuration options.
				</p>
			</TabsContent>
		</Tabs>
	),
};

// ---------------------------------------------------------------------------
// ManyTabs — overflow / wide list to verify wrapping behaviour
// ---------------------------------------------------------------------------

export const ManyTabs: Story = {
	render: () => (
		<Tabs defaultValue="overview">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="runs">Runs</TabsTrigger>
				<TabsTrigger value="artifacts">Artifacts</TabsTrigger>
				<TabsTrigger value="models">Models</TabsTrigger>
				<TabsTrigger value="deployments">Deployments</TabsTrigger>
				<TabsTrigger value="schedules">Schedules</TabsTrigger>
				<TabsTrigger value="secrets">Secrets</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" className="mt-4">
				<p className="text-muted-foreground text-sm">Pipeline overview.</p>
			</TabsContent>
			<TabsContent value="runs" className="mt-4">
				<p className="text-muted-foreground text-sm">Run history.</p>
			</TabsContent>
			<TabsContent value="artifacts" className="mt-4">
				<p className="text-muted-foreground text-sm">Registered artifacts.</p>
			</TabsContent>
			<TabsContent value="models" className="mt-4">
				<p className="text-muted-foreground text-sm">Registered models.</p>
			</TabsContent>
			<TabsContent value="deployments" className="mt-4">
				<p className="text-muted-foreground text-sm">Active deployments.</p>
			</TabsContent>
			<TabsContent value="schedules" className="mt-4">
				<p className="text-muted-foreground text-sm">Configured schedules.</p>
			</TabsContent>
			<TabsContent value="secrets" className="mt-4">
				<p className="text-muted-foreground text-sm">Secret references.</p>
			</TabsContent>
			<TabsContent value="settings" className="mt-4">
				<p className="text-muted-foreground text-sm">Pipeline settings.</p>
			</TabsContent>
		</Tabs>
	),
};

// ---------------------------------------------------------------------------
// Composed — realistic execution-detail panel (line variant + icons + content)
// ---------------------------------------------------------------------------

export const Composed: Story = {
	render: () => (
		<div className="border-border rounded-lg border">
			<div className="border-border flex items-center justify-between border-b px-4 py-3">
				<span className="text-sm font-medium">train_model · step</span>
				<span className="text-muted-foreground text-xs">2m 14s</span>
			</div>
			<Tabs defaultValue="overview">
				<div className="border-border border-b px-4">
					<TabsList variant="line">
						<TabsTrigger value="overview">
							<Info />
							Overview
						</TabsTrigger>
						<TabsTrigger value="code">
							<CodeXml />
							Code
						</TabsTrigger>
						<TabsTrigger value="logs">
							<FileText />
							Logs
						</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="overview" className="p-4">
					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Pipeline</span>
							<span className="font-mono">production-traces</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Stack</span>
							<span className="font-mono">zenml-eu-central</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Orchestrator</span>
							<span className="font-mono">kubernetes</span>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="code" className="p-4">
					<pre className="text-muted-foreground bg-muted rounded p-3 font-mono text-xs">
						{`@step\ndef train_model(dataset: pd.DataFrame) -> Model:\n    ...\n`}
					</pre>
				</TabsContent>
				<TabsContent value="logs" className="p-4">
					<pre className="text-muted-foreground bg-muted rounded p-3 font-mono text-xs">
						{`[INFO] Loading dataset from artifact store\n[INFO] Training started\n[INFO] Epoch 1/10 — loss: 0.421\n`}
					</pre>
				</TabsContent>
			</Tabs>
		</div>
	),
};
