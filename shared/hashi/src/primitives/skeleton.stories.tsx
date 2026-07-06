import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
	title: "Primitives/Skeleton",
	component: Skeleton,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=73-5",
		},
	},
	args: {
		className: "h-12 w-12",
	},
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const Shapes: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-4">
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-semibold">
					Circle
				</p>
				<Skeleton className="h-12 w-12 rounded-full" />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-semibold">
					Square
				</p>
				<Skeleton className="h-12 w-12 rounded-md" />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-semibold">
					Rectangle
				</p>
				<Skeleton className="h-8 w-32 rounded-md" />
			</div>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-4">
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-semibold">
					Small
				</p>
				<Skeleton className="h-4 w-20 rounded-md" />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-semibold">
					Default
				</p>
				<Skeleton className="h-8 w-32 rounded-md" />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-semibold">
					Large
				</p>
				<Skeleton className="h-12 w-48 rounded-md" />
			</div>
		</div>
	),
};

export const LoadingCard: Story = {
	render: () => (
		<div className="border-border bg-card w-full max-w-sm space-y-4 rounded-lg border p-4">
			<Skeleton className="h-4 w-3/4 rounded-md" />
			<div className="space-y-2">
				<Skeleton className="h-3 w-full rounded-md" />
				<Skeleton className="h-3 w-5/6 rounded-md" />
				<Skeleton className="h-3 w-4/5 rounded-md" />
			</div>
			<div className="flex gap-2 pt-2">
				<Skeleton className="h-8 w-20 rounded-md" />
				<Skeleton className="h-8 w-20 rounded-md" />
			</div>
		</div>
	),
};

export const LoadingList: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className="border-border bg-card flex gap-3 rounded-lg border p-3"
				>
					<Skeleton className="h-10 w-10 flex-shrink-0 rounded-md" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-3 w-3/4 rounded-md" />
						<Skeleton className="h-3 w-1/2 rounded-md" />
					</div>
				</div>
			))}
		</div>
	),
};

export const LoadingTable: Story = {
	render: () => (
		<div className="w-full max-w-2xl space-y-3">
			<div className="border-border bg-card grid grid-cols-4 gap-4 rounded-lg border p-4">
				<Skeleton className="h-4 w-full rounded-md" />
				<Skeleton className="h-4 w-full rounded-md" />
				<Skeleton className="h-4 w-full rounded-md" />
				<Skeleton className="h-4 w-full rounded-md" />
			</div>
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className="border-border bg-card grid grid-cols-4 gap-4 rounded-lg border p-4"
				>
					<Skeleton className="h-4 w-full rounded-md" />
					<Skeleton className="h-4 w-full rounded-md" />
					<Skeleton className="h-4 w-full rounded-md" />
					<Skeleton className="h-4 w-full rounded-md" />
				</div>
			))}
		</div>
	),
};
