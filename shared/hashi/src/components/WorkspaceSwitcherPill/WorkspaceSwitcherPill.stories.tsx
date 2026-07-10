import type { Meta, StoryObj } from "@storybook/react-vite";

import { WORKSPACES } from "../../storybook/fixtures";

import { WorkspaceSwitcherPillView } from "./WorkspaceSwitcherPill";

/**
 * `WorkspaceSwitcherPillView` is the presentational workspace breadcrumb
 * pill. It's a `SwitcherPill` wired to a `SwitcherDropdownMenu` that groups
 * workspaces by type (ZenML, then Kitaru), shows a version badge and member
 * count per row, and ends with a "Back to organization" footer action.
 *
 * It's a pure view: the consumer supplies `labelRender` (the navigable label
 * wrapper — a router `Link` in the app, a plain anchor here) plus the select
 * and back callbacks. Open the chevron half to see the grouped list and the
 * type-grouped headings; type to search across all types.
 */
const meta: Meta<typeof WorkspaceSwitcherPillView> = {
	title: "Components/WorkspaceSwitcherPill",
	component: WorkspaceSwitcherPillView,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-507",
		},
	},
};

export default meta;
type Story = StoryObj<typeof WorkspaceSwitcherPillView>;

// The original mixed ZenML + Kitaru list: every canonical workspace except the
// extra `ml-platform-staging` staging entry the prefix-slice stories use.
const items = WORKSPACES.filter((w) => w.slug !== "ml-platform-staging");

const labelRender = <a href="#" />;

/**
 * Default: a mixed set of ZenML and Kitaru workspaces. The dropdown groups by
 * type with a divider between groups; the active row carries the check.
 */
export const Default: Story = {
	args: {
		items,
		selected: items[0],
		labelRender,
		onSelectWorkspace: () => {},
		onBackToOrganization: () => {},
	},
};

/**
 * A Kitaru workspace is selected, so the pill label reflects the Kitaru
 * workspace and that row carries the active check inside the Kitaru group.
 */
export const KitaruSelected: Story = {
	args: {
		items,
		selected: items[3],
		labelRender,
		onSelectWorkspace: () => {},
		onBackToOrganization: () => {},
	},
};

/**
 * Single-type set: when every workspace is one type, the grouping collapses
 * to a single group with no orphan separator above the first row.
 */
export const SingleType: Story = {
	args: {
		items: items.filter((w) => w.type === "zenml"),
		selected: items.filter((w) => w.type === "zenml")[0],
		labelRender,
		onSelectWorkspace: () => {},
		onBackToOrganization: () => {},
	},
};

/**
 * Long workspace name truncates inside the pill label rather than pushing the
 * chevron trigger out of the breadcrumb.
 */
export const LongName: Story = {
	render: () => {
		const longItems: typeof items = [
			{
				name: "zenml-eu-central-production-inference-cluster",
				slug: "zenml-eu-central-prod",
				type: "zenml",
				version: "0.84.1",
				memberCount: 8,
			},
			...items.slice(1),
		];
		return (
			<div className="w-80">
				<WorkspaceSwitcherPillView
					items={longItems}
					selected={longItems[0]}
					labelRender={labelRender}
					onSelectWorkspace={() => {}}
					onBackToOrganization={() => {}}
				/>
			</div>
		);
	},
};

/**
 * Realistic navbar slot: the workspace pill rendered on a surface the way it
 * sits at the left edge of the app breadcrumb. Open it to read the full
 * grouped picker with versions and member counts.
 */
export const Composed: Story = {
	render: () => (
		<div className="border-border bg-card flex h-12 items-center gap-2 rounded-md border px-3">
			<WorkspaceSwitcherPillView
				items={items}
				selected={items[0]}
				labelRender={labelRender}
				onSelectWorkspace={() => {}}
				onBackToOrganization={() => {}}
			/>
		</div>
	),
};
