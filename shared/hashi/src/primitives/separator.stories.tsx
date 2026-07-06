import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
	title: "Primitives/Separator",
	component: Separator,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=72-7",
		},
	},
	args: {
		orientation: "horizontal",
		decorative: true,
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
		decorative: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {};

export const Horizontal: Story = {
	render: () => (
		<div className="space-y-3">
			<p className="text-muted-foreground text-sm">Section 1</p>
			<Separator />
			<p className="text-muted-foreground text-sm">Section 2</p>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<p className="text-muted-foreground text-sm">Left</p>
			<Separator orientation="vertical" className="h-6" />
			<p className="text-muted-foreground text-sm">Right</p>
		</div>
	),
};

export const InMenuContext: Story = {
	render: () => (
		<div className="border-border overflow-hidden rounded-lg border">
			<div className="p-2">
				<button className="hover:bg-accent w-full rounded px-2 py-1.5 text-left text-sm">
					Edit
				</button>
				<button className="hover:bg-accent w-full rounded px-2 py-1.5 text-left text-sm">
					Duplicate
				</button>
			</div>
			<Separator />
			<div className="p-2">
				<button className="text-destructive hover:bg-destructive/10 w-full rounded px-2 py-1.5 text-left text-sm">
					Delete
				</button>
			</div>
		</div>
	),
};

export const AsAriaRole: Story = {
	render: () => (
		<div className="space-y-3">
			<h3 className="text-sm font-medium">With aria-role separator</h3>
			<p className="text-muted-foreground text-sm">
				This separator has semantic role for screen readers.
			</p>
			<Separator decorative={false} />
			<p className="text-muted-foreground text-sm">Section below.</p>
		</div>
	),
};
