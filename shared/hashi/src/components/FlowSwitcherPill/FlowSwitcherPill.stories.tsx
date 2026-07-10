import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FlowStatus } from "@zenml/hashi/lib/state-styles";

import { FlowSwitcherPillView } from "./FlowSwitcherPill";

/**
 * `FlowSwitcherPillView` is the presentational flow breadcrumb pill. Each
 * dropdown row pairs a `StatusDot` (active / paused / error) with the flow
 * name and a "N ver · M exec" counter (or "no deployments" when a flow has
 * none yet), and ends with a "New flow" footer action.
 *
 * Pure view: the consumer supplies `labelRender` (the navigable label
 * wrapper — a router `Link` in the app, a plain anchor here), the
 * `statsById` map, and the select / create callbacks. Open the chevron half
 * to see the status dots and per-flow stats; type to search by name or id.
 */
const meta: Meta<typeof FlowSwitcherPillView> = {
	title: "Components/FlowSwitcherPill",
	component: FlowSwitcherPillView,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-507",
		},
	},
};

export default meta;
type Story = StoryObj<typeof FlowSwitcherPillView>;

const items: { id: string; name: string; status: FlowStatus }[] = [
	{ id: "flow-content", name: "content-pipeline", status: "active" },
	{ id: "flow-churn", name: "customer-churn-prediction", status: "active" },
	{ id: "flow-monitor", name: "monitor-agent", status: "paused" },
	{ id: "flow-ingest", name: "data-ingestion", status: "error" },
	{ id: "flow-new", name: "experiment-sandbox", status: "paused" },
];

const statsById: Record<string, { versions: number; execs: number }> = {
	"flow-content": { versions: 12, execs: 142 },
	"flow-churn": { versions: 7, execs: 88 },
	"flow-monitor": { versions: 4, execs: 31 },
	"flow-ingest": { versions: 9, execs: 256 },
	"flow-new": { versions: 0, execs: 0 },
};

const labelRender = <a href="#" />;

/**
 * Default: a set of flows spanning all three statuses. Note the
 * `experiment-sandbox` row, which has no deployments and renders "no
 * deployments" instead of a version/exec counter.
 */
export const Default: Story = {
	args: {
		items,
		selected: items[0],
		statsById,
		labelRender,
		onSelectFlow: () => {},
		onCreateFlow: () => {},
	},
};

/**
 * A paused flow is selected. The pill label reflects it and the active check
 * lands on its row, next to the paused (muted) status dot.
 */
export const PausedSelected: Story = {
	args: {
		items,
		selected: items[2],
		statsById,
		labelRender,
		onSelectFlow: () => {},
		onCreateFlow: () => {},
	},
};

/**
 * Status coverage: one flow per `FlowStatus` so the active / paused / error
 * dots are all visible in a single dropdown.
 */
export const AllStatuses: Story = {
	render: () => {
		const oneEach: typeof items = [
			{ id: "f-active", name: "content-pipeline", status: "active" },
			{ id: "f-paused", name: "monitor-agent", status: "paused" },
			{ id: "f-error", name: "data-ingestion", status: "error" },
		];
		const stats: typeof statsById = {
			"f-active": { versions: 12, execs: 142 },
			"f-paused": { versions: 4, execs: 31 },
			"f-error": { versions: 9, execs: 256 },
		};
		return (
			<FlowSwitcherPillView
				items={oneEach}
				selected={oneEach[0]}
				statsById={stats}
				labelRender={labelRender}
				onSelectFlow={() => {}}
				onCreateFlow={() => {}}
			/>
		);
	},
};

/**
 * Fresh flow with no deployments: when a flow's stats report zero versions,
 * the row shows "no deployments" instead of a counter.
 */
export const NoDeployments: Story = {
	args: {
		items: [items[4]],
		selected: items[4],
		statsById,
		labelRender,
		onSelectFlow: () => {},
		onCreateFlow: () => {},
	},
};

/**
 * Long flow name truncates inside the pill label; the dropdown row keeps the
 * status dot, truncating name, and trailing counter aligned.
 */
export const LongName: Story = {
	render: () => {
		const longItems: typeof items = [
			{
				id: "flow-long",
				name: "customer-lifetime-value-batch-scoring-pipeline",
				status: "active",
			},
			...items.slice(1),
		];
		return (
			<div className="w-80">
				<FlowSwitcherPillView
					items={longItems}
					selected={longItems[0]}
					statsById={{
						"flow-long": { versions: 21, execs: 1284 },
						...statsById,
					}}
					labelRender={labelRender}
					onSelectFlow={() => {}}
					onCreateFlow={() => {}}
				/>
			</div>
		);
	},
};

/**
 * Realistic navbar slot: the flow pill on a card surface, the way it sits at
 * the right end of the app breadcrumb. Open it to read the full status-dotted
 * picker.
 */
export const Composed: Story = {
	render: () => (
		<div className="border-border bg-card flex h-12 items-center gap-2 rounded-md border px-3">
			<FlowSwitcherPillView
				items={items}
				selected={items[1]}
				statsById={statsById}
				labelRender={labelRender}
				onSelectFlow={() => {}}
				onCreateFlow={() => {}}
			/>
		</div>
	),
};
