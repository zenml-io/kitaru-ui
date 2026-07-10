import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
	title: "Primitives/Switch",
	component: Switch,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=69-13",
		},
	},
	args: {
		size: "default",
		disabled: false,
		defaultChecked: false,
	},
	argTypes: {
		size: {
			control: "select",
			options: ["default", "sm"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
	render: (args) => <Switch aria-label="Example switch" {...args} />,
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<Switch size="default" defaultChecked aria-label="Default size, on" />
				<span className="text-sm">Default</span>
			</div>
			<div className="flex items-center gap-2">
				<Switch size="sm" defaultChecked aria-label="Small size, on" />
				<span className="text-sm">Small</span>
			</div>
		</div>
	),
};

export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<Switch aria-label="Unchecked" />
				<span className="text-muted-foreground text-sm">Unchecked</span>
			</div>
			<div className="flex items-center gap-2">
				<Switch defaultChecked aria-label="Checked" />
				<span className="text-muted-foreground text-sm">Checked</span>
			</div>
			<div className="flex items-center gap-2">
				<Switch disabled aria-label="Disabled, unchecked" />
				<span className="text-muted-foreground text-sm">Disabled</span>
			</div>
			<div className="flex items-center gap-2">
				<Switch disabled defaultChecked aria-label="Disabled, checked" />
				<span className="text-muted-foreground text-sm">
					Disabled + checked
				</span>
			</div>
		</div>
	),
};

export const SmallStates: Story = {
	name: "States (small)",
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<Switch size="sm" aria-label="Small, unchecked" />
				<span className="text-muted-foreground text-xs">Unchecked</span>
			</div>
			<div className="flex items-center gap-2">
				<Switch size="sm" defaultChecked aria-label="Small, checked" />
				<span className="text-muted-foreground text-xs">Checked</span>
			</div>
			<div className="flex items-center gap-2">
				<Switch size="sm" disabled aria-label="Small, disabled" />
				<span className="text-muted-foreground text-xs">Disabled</span>
			</div>
			<div className="flex items-center gap-2">
				<Switch
					size="sm"
					disabled
					defaultChecked
					aria-label="Small, disabled + checked"
				/>
				<span className="text-muted-foreground text-xs">
					Disabled + checked
				</span>
			</div>
		</div>
	),
};

/**
 * Paired with a label via htmlFor — the standard pattern for settings forms.
 * The label text stays on the right; the switch sits inline with it.
 */
export const WithLabel: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<label className="flex cursor-pointer items-center gap-2.5">
				<Switch id="email-notifs" aria-labelledby="email-notifs-label" />
				<span id="email-notifs-label" className="text-sm">
					Email notifications
				</span>
			</label>
			<label className="flex cursor-pointer items-center gap-2.5">
				<Switch
					id="trace-index"
					defaultChecked
					aria-labelledby="trace-index-label"
				/>
				<span id="trace-index-label" className="text-sm">
					Index production traces
				</span>
			</label>
		</div>
	),
};

/**
 * Switch placed on the right side with a description — common in settings panels.
 */
export const LabelLeft: Story = {
	name: "Label left (settings row)",
	render: () => {
		const rows = [
			{
				id: "auto-deploy",
				label: "Auto-deploy on push",
				description:
					"Trigger a new deployment whenever the linked flow version changes.",
				defaultChecked: true,
			},
			{
				id: "cache-steps",
				label: "Cache step outputs",
				description: "Reuse cached artifacts for unchanged steps between runs.",
				defaultChecked: false,
			},
			{
				id: "alerts-slack",
				label: "Slack failure alerts",
				description: "Post a message to #ml-alerts when an execution fails.",
				defaultChecked: true,
			},
		];

		return (
			<div className="divide-border flex w-80 flex-col divide-y">
				{rows.map((row) => (
					<label
						key={row.id}
						className="flex cursor-pointer items-start justify-between gap-4 py-3"
					>
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-medium">{row.label}</span>
							<span className="text-muted-foreground text-xs text-pretty">
								{row.description}
							</span>
						</div>
						<Switch
							id={row.id}
							defaultChecked={row.defaultChecked}
							className="mt-0.5 shrink-0"
						/>
					</label>
				))}
			</div>
		);
	},
};

/**
 * Small switch with an inline label + trailing status — exactly as used in the
 * tag editor inside the deployments feature ("Exclusive / Shareable" toggle).
 */
export const InlineWithStatus: Story = {
	name: "Inline with status (tag editor pattern)",
	render: function Render() {
		const [exclusive, setExclusive] = React.useState(false);
		return (
			<label className="flex w-56 items-center justify-between gap-2 text-xs">
				<span className="flex items-center gap-2">
					<Switch
						size="sm"
						checked={exclusive}
						onCheckedChange={(v) => setExclusive(Boolean(v))}
					/>
					<span className="text-foreground">Exclusive</span>
				</span>
				<span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
					{exclusive ? "one deployment" : "shareable"}
				</span>
			</label>
		);
	},
};

/**
 * Controlled switch — demonstrates programmatic checked/unchecked state.
 */
export const Controlled: Story = {
	render: function Render() {
		const [checked, setChecked] = React.useState(false);
		return (
			<div className="flex flex-col items-start gap-3">
				<label className="flex cursor-pointer items-center gap-2.5">
					<Switch
						checked={checked}
						onCheckedChange={(v) => setChecked(Boolean(v))}
						aria-label="Toggle production mode"
					/>
					<span className="text-sm">
						Production mode:{" "}
						<span className="font-mono font-semibold">
							{checked ? "on" : "off"}
						</span>
					</span>
				</label>
				<button
					type="button"
					onClick={() => setChecked((prev) => !prev)}
					className="text-muted-foreground text-xs underline underline-offset-2"
				>
					Toggle externally
				</button>
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		defaultChecked: false,
	},
	render: (args) => <Switch aria-label="Example switch" {...args} />,
};
