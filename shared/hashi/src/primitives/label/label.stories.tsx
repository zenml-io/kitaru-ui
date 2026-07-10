import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { Input } from "../input/input";
import { Checkbox } from "../checkbox/checkbox";

const meta: Meta<typeof Label> = {
	title: "Primitives/Label",
	component: Label,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=67-9",
		},
	},
	args: {
		children: "Label",
	},
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const WithInput: Story = {
	render: () => (
		<div className="flex max-w-xs flex-col gap-1.5">
			<Label htmlFor="email">Email address</Label>
			<Input id="email" type="email" placeholder="you@company.com" />
		</div>
	),
};

export const WithCheckbox: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<Checkbox id="terms" />
			<Label htmlFor="terms">I agree to the terms and conditions</Label>
		</div>
	),
};

export const MultipleLabels: Story = {
	render: () => (
		<div className="flex max-w-sm flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="username">Username</Label>
				<Input id="username" placeholder="johndoe" />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="password">Password</Label>
				<Input id="password" type="password" />
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="workspace">Workspace name</Label>
				<Input id="workspace" placeholder="my-workspace" />
			</div>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<fieldset className="flex max-w-xs flex-col gap-1.5" disabled>
			<Label htmlFor="disabled-input">Production secret</Label>
			<Input id="disabled-input" value="***hidden***" readOnly />
		</fieldset>
	),
};

export const LongText: Story = {
	render: () => (
		<div className="flex max-w-xs flex-col gap-1.5">
			<Label htmlFor="project-desc">
				Provide a detailed description of your production workflow and
				deployment pipeline
			</Label>
			<Input id="project-desc" placeholder="Enter text..." />
		</div>
	),
};
