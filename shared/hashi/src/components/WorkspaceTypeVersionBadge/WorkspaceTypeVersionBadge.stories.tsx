import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkspaceTypeVersionBadge } from "./WorkspaceTypeVersionBadge";

const meta: Meta<typeof WorkspaceTypeVersionBadge> = {
	title: "Components/WorkspaceTypeVersionBadge",
	component: WorkspaceTypeVersionBadge,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=90-15",
		},
		layout: "centered",
	},
	args: {
		type: "zenml",
		version: "0.94.1",
	},
	argTypes: {
		type: {
			control: "select",
			options: ["zenml", "kitaru"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof WorkspaceTypeVersionBadge>;

export const Default: Story = {};

// Both workspace type flavors side-by-side. Colors are type-anchored, so the
// Kitaru pill stays peach regardless of the active app theme. The ZenML pill
// carries the ZenML brand color: sage-green under the ZenML and Kitaru brands,
// purple under the legacy zenml-pro brand.
export const Types: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					ZenML
				</span>
				<WorkspaceTypeVersionBadge type="zenml" version="0.94.1" />
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Kitaru
				</span>
				<WorkspaceTypeVersionBadge type="kitaru" version="0.18.2" />
			</div>
		</div>
	),
};

// Version strings in realistic semver formats a consumer might pass.
export const VersionFormats: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Short patch
				</span>
				<WorkspaceTypeVersionBadge type="zenml" version="0.94.1" />
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Single-digit minor
				</span>
				<WorkspaceTypeVersionBadge type="zenml" version="1.0.0" />
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Pre-release suffix (long string)
				</span>
				<WorkspaceTypeVersionBadge type="kitaru" version="0.18.2-rc.3" />
			</div>
		</div>
	),
};

// Inline placement inside a row — the badge sits naturally in a flex row next
// to a workspace name, as it does in WorkspaceCard and switcher pills.
export const InlineWithText: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<span className="text-foreground font-mono text-sm font-semibold">
					production-eu-central
				</span>
				<WorkspaceTypeVersionBadge type="zenml" version="0.94.1" />
			</div>
			<div className="flex items-center gap-2">
				<span className="text-foreground font-mono text-sm font-semibold">
					feature-kitaru-alpha
				</span>
				<WorkspaceTypeVersionBadge type="kitaru" version="0.18.2" />
			</div>
		</div>
	),
};

// Both types on a tinted/colored surface to confirm that the inline style
// colors remain legible regardless of the surface behind them.
export const OnTintedSurface: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="bg-muted flex items-center gap-3 rounded-lg p-4">
				<span className="text-muted-foreground text-xs">Muted surface</span>
				<WorkspaceTypeVersionBadge type="zenml" version="0.94.1" />
				<WorkspaceTypeVersionBadge type="kitaru" version="0.18.2" />
			</div>
			<div className="bg-primary/10 flex items-center gap-3 rounded-lg p-4">
				<span className="text-muted-foreground text-xs">
					Primary tint surface
				</span>
				<WorkspaceTypeVersionBadge type="zenml" version="0.94.1" />
				<WorkspaceTypeVersionBadge type="kitaru" version="0.18.2" />
			</div>
		</div>
	),
};
