import type { Meta, StoryObj } from "@storybook/react-vite";
import type { WorkspaceStatus } from "@zenml/hashi/lib/state-styles";

import { WorkspaceStatusDot } from "./WorkspaceStatusDot";

const workspaceStatuses: WorkspaceStatus[] = ["running", "degraded", "idle"];

const meta: Meta<typeof WorkspaceStatusDot> = {
	title: "Components/WorkspaceStatusDot",
	component: WorkspaceStatusDot,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=88-8",
		},
	},
	args: {
		status: "running",
		withTooltip: false,
	},
	argTypes: {
		status: {
			control: "select",
			options: workspaceStatuses,
		},
		withTooltip: {
			control: "boolean",
		},
	},
};

export default meta;
type Story = StoryObj<typeof WorkspaceStatusDot>;

export const Default: Story = {};

/**
 * All three workspace health states without a tooltip. Used as a bare
 * indicator alongside a workspace name in dense list rows.
 */
export const AllStatuses: Story = {
	render: () => (
		<div className="flex flex-wrap gap-x-6 gap-y-3">
			{workspaceStatuses.map((status) => (
				<span key={status} className="flex items-center gap-2 text-sm">
					<WorkspaceStatusDot status={status} />
					<span className="text-muted-foreground capitalize">{status}</span>
				</span>
			))}
		</div>
	),
};

/**
 * withTooltip=true wraps the dot in a Tooltip whose content is the
 * human-readable status label (e.g. "Degraded"). Hover each dot to verify.
 * This is the pattern used on workspace cards.
 */
export const WithTooltip: Story = {
	render: () => (
		<div className="flex flex-wrap gap-6">
			{workspaceStatuses.map((status) => (
				<WorkspaceStatusDot key={status} status={status} withTooltip />
			))}
		</div>
	),
};

/**
 * Realistic workspace card footer. The dot appears in the identity column
 * beside the workspace name; withTooltip provides the label for screen
 * readers and pointer users without cluttering the row.
 */
export const Composed: Story = {
	render: () => (
		<div className="border-border w-80 divide-y rounded-lg border text-sm">
			{[
				{
					name: "zenml-eu-central",
					region: "eu-central-1",
					status: "running" as WorkspaceStatus,
				},
				{
					name: "zenml-us-east-staging",
					region: "us-east-1",
					status: "degraded" as WorkspaceStatus,
				},
				{
					name: "zenml-ap-southeast",
					region: "ap-southeast-2",
					status: "idle" as WorkspaceStatus,
				},
			].map(({ name, region, status }) => (
				<div
					key={name}
					className="flex items-center justify-between px-3 py-2.5"
				>
					<span className="flex items-center gap-2">
						<WorkspaceStatusDot status={status} withTooltip />
						<span className="text-foreground font-medium">{name}</span>
					</span>
					<span className="text-muted-foreground text-xs">{region}</span>
				</div>
			))}
		</div>
	),
};

/**
 * Custom className: consumers can adjust margin or override size by passing
 * className. The status color from getWorkspaceStatusDotClass is preserved.
 */
export const CustomClassName: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<WorkspaceStatusDot status="running" className="size-2" />
			<WorkspaceStatusDot status="running" />
			<WorkspaceStatusDot status="running" className="size-3" />
		</div>
	),
};
