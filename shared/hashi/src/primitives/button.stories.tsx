import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Trash2 } from "lucide-react";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
	title: "Primitives/Button",
	component: Button,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=46-2",
		},
	},
	args: {
		children: "Button",
		variant: "default",
		size: "default",
		disabled: false,
	},
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"destructive",
				"outline",
				"secondary",
				"ghost",
				"link",
			],
		},
		size: {
			control: "select",
			options: [
				"xs",
				"sm",
				"default",
				"lg",
				"icon-xs",
				"icon-sm",
				"icon",
				"icon-lg",
			],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button>Default</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button size="xs">Extra small</Button>
			<Button size="sm">Small</Button>
			<Button size="default">Default</Button>
			<Button size="lg">Large</Button>
		</div>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Button>
				<Mail /> Email
			</Button>
			<Button variant="destructive">
				<Trash2 /> Delete
			</Button>
			<Button variant="outline" size="icon" aria-label="Send email">
				<Mail />
			</Button>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
