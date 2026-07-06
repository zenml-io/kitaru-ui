import type { Meta, StoryObj } from "@storybook/react-vite";

import { ColorDot } from "./color-dot";

const meta: Meta<typeof ColorDot> = {
	title: "Primitives/ColorDot",
	component: ColorDot,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=76-11",
		},
	},
	args: {
		shape: "square",
		size: "sm",
		className: "bg-primary",
	},
	argTypes: {
		shape: {
			control: "select",
			options: ["round", "square"],
		},
		size: {
			control: "select",
			options: ["xs", "sm", "md"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof ColorDot>;

export const Default: Story = {};

export const Shapes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-8">
			<div className="flex flex-col items-start gap-2">
				<span className="text-muted-foreground text-xs">Round</span>
				<ColorDot shape="round" size="md" className="bg-primary" />
			</div>
			<div className="flex flex-col items-start gap-2">
				<span className="text-muted-foreground text-xs">Square</span>
				<ColorDot shape="square" size="md" className="bg-primary" />
			</div>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-8">
			<div className="flex flex-col items-start gap-2">
				<span className="text-muted-foreground text-xs">xs</span>
				<ColorDot shape="round" size="xs" className="bg-primary" />
			</div>
			<div className="flex flex-col items-start gap-2">
				<span className="text-muted-foreground text-xs">sm</span>
				<ColorDot shape="round" size="sm" className="bg-primary" />
			</div>
			<div className="flex flex-col items-start gap-2">
				<span className="text-muted-foreground text-xs">md</span>
				<ColorDot shape="round" size="md" className="bg-primary" />
			</div>
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className="space-y-6">
			<div>
				<h4 className="text-muted-foreground mb-3 text-xs font-semibold uppercase">
					Round
				</h4>
				<div className="flex flex-wrap items-center gap-6">
					<div className="flex items-center gap-2">
						<ColorDot shape="round" size="md" className="bg-primary" />
						<span className="text-muted-foreground text-xs">primary</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="round" size="md" className="bg-warning" />
						<span className="text-muted-foreground text-xs">warning</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="round" size="md" className="bg-success" />
						<span className="text-muted-foreground text-xs">success</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="round" size="md" className="bg-destructive" />
						<span className="text-muted-foreground text-xs">destructive</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="round" size="md" className="bg-info" />
						<span className="text-muted-foreground text-xs">info</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="round" size="md" className="bg-muted-foreground" />
						<span className="text-muted-foreground text-xs">muted</span>
					</div>
				</div>
			</div>
			<div>
				<h4 className="text-muted-foreground mb-3 text-xs font-semibold uppercase">
					Square
				</h4>
				<div className="flex flex-wrap items-center gap-6">
					<div className="flex items-center gap-2">
						<ColorDot shape="square" size="md" className="bg-primary" />
						<span className="text-muted-foreground text-xs">primary</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="square" size="md" className="bg-warning" />
						<span className="text-muted-foreground text-xs">warning</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="square" size="md" className="bg-success" />
						<span className="text-muted-foreground text-xs">success</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="square" size="md" className="bg-destructive" />
						<span className="text-muted-foreground text-xs">destructive</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot shape="square" size="md" className="bg-info" />
						<span className="text-muted-foreground text-xs">info</span>
					</div>
					<div className="flex items-center gap-2">
						<ColorDot
							shape="square"
							size="md"
							className="bg-muted-foreground"
						/>
						<span className="text-muted-foreground text-xs">muted</span>
					</div>
				</div>
			</div>
		</div>
	),
};

export const WithLabel: Story = {
	render: () => (
		<div className="flex items-center gap-2">
			<ColorDot shape="square" size="sm" className="bg-primary" />
			<span className="text-foreground text-sm">Production traces</span>
		</div>
	),
};
