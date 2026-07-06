import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProjectSwitcherPillView } from "./ProjectSwitcherPill";

/**
 * `ProjectSwitcherPillView` is the presentational project breadcrumb pill. It
 * wires a `SwitcherPill` to a `SwitcherDropdownMenu` of projects, each row
 * showing the project name plus a "N pipe · M exec" counter, and an "All
 * projects" footer action.
 *
 * Pure view: the consumer supplies `labelRender` (the navigable label
 * wrapper — a router `Link` in the app, a plain anchor here) and the select /
 * open-all callbacks. Open the chevron half to see the filtered list; type to
 * search by name or slug.
 */
const meta: Meta<typeof ProjectSwitcherPillView> = {
	title: "Components/ProjectSwitcherPill",
	component: ProjectSwitcherPillView,
};

export default meta;
type Story = StoryObj<typeof ProjectSwitcherPillView>;

const items = [
	{ slug: "default", name: "default", pipelineCount: 6, executionCount: 142 },
	{
		slug: "fraud-detection",
		name: "fraud-detection",
		pipelineCount: 3,
		executionCount: 87,
	},
	{
		slug: "recommendations",
		name: "recommendations",
		pipelineCount: 4,
		executionCount: 211,
	},
	{
		slug: "customer-churn",
		name: "customer-churn",
		pipelineCount: 2,
		executionCount: 38,
	},
];

const labelRender = <a href="#" />;

/**
 * Default: a short project list with the first project active. The trailing
 * counter renders pipeline and execution totals per row.
 */
export const Default: Story = {
	args: {
		items,
		selected: items[0],
		labelRender,
		onSelectProject: () => {},
		onOpenAllProjects: () => {},
	},
};

/**
 * A non-default project selected — the pill label and the active check move
 * to that row.
 */
export const NonDefaultSelected: Story = {
	args: {
		items,
		selected: items[2],
		labelRender,
		onSelectProject: () => {},
		onOpenAllProjects: () => {},
	},
};

/**
 * Single project: the only common edge for a fresh organization. The list
 * shows one active row above the "All projects" footer.
 */
export const SingleProject: Story = {
	args: {
		items: items.slice(0, 1),
		selected: items[0],
		labelRender,
		onSelectProject: () => {},
		onOpenAllProjects: () => {},
	},
};

/**
 * Long project name truncates inside the pill label; the trailing counter on
 * each dropdown row stays on one line via `whitespace-nowrap`.
 */
export const LongName: Story = {
	render: () => {
		const longItems = [
			{
				slug: "customer-lifetime-value-modeling",
				name: "customer-lifetime-value-modeling",
				pipelineCount: 9,
				executionCount: 1284,
			},
			...items.slice(1),
		];
		return (
			<div className="w-80">
				<ProjectSwitcherPillView
					items={longItems}
					selected={longItems[0]}
					labelRender={labelRender}
					onSelectProject={() => {}}
					onOpenAllProjects={() => {}}
				/>
			</div>
		);
	},
};

/**
 * Realistic navbar slot: the project pill on a card surface, the way it sits
 * between the workspace and flow pills in the app breadcrumb.
 */
export const Composed: Story = {
	render: () => (
		<div className="border-border bg-card flex h-12 items-center gap-2 rounded-md border px-3">
			<ProjectSwitcherPillView
				items={items}
				selected={items[1]}
				labelRender={labelRender}
				onSelectProject={() => {}}
				onOpenAllProjects={() => {}}
			/>
		</div>
	),
};
