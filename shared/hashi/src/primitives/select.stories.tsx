import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Database, FolderGit2, GitBranch } from "lucide-react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "./select";

/**
 * `Select` is the Base UI single-select composed from `Select` (root),
 * `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, and the
 * grouping parts (`SelectGroup` / `SelectLabel` / `SelectSeparator`).
 *
 * The root is uncontrolled by default — pass `defaultValue` for the initial
 * selection or `value` + `onValueChange` to control it. `SelectValue` renders
 * the selected item's label; pass `placeholder` for the empty state.
 *
 * Only the `Open` story uses `defaultOpen`; all other stories render closed so
 * that the autodocs page does not portal multiple popups at once over the docs
 * content. Click any trigger to see its popup.
 */
const meta: Meta<typeof Select> = {
	title: "Primitives/Select",
	component: Select,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=82-29",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Select>;

// ─── Default ─────────────────────────────────────────────────────────────────

/**
 * The minimal composition: a trigger showing the placeholder until an item is
 * chosen, then the selected label. `w-56` gives a stable width so the trigger
 * doesn't resize as the selection changes.
 */
export const Default: Story = {
	render: () => (
		<Select>
			<SelectTrigger aria-label="Environment" className="w-56">
				<SelectValue placeholder="Select an environment" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="production">Production</SelectItem>
				<SelectItem value="staging">Staging</SelectItem>
				<SelectItem value="development">Development</SelectItem>
			</SelectContent>
		</Select>
	),
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

/**
 * `SelectTrigger` ships two heights via the `size` prop: `default` (h-9) for
 * forms and `sm` (h-8) for dense toolbars. The popup is unaffected.
 */
export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Select defaultValue="production">
				<SelectTrigger
					size="default"
					aria-label="Environment (default size)"
					className="w-44"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="production">Production</SelectItem>
					<SelectItem value="staging">Staging</SelectItem>
				</SelectContent>
			</Select>
			<Select defaultValue="production">
				<SelectTrigger
					size="sm"
					aria-label="Environment (small size)"
					className="w-44"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="production">Production</SelectItem>
					<SelectItem value="staging">Staging</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};

// ─── Default value ───────────────────────────────────────────────────────────

/**
 * `defaultValue` pre-selects an item in the uncontrolled root. The trigger
 * renders that item's label immediately, with no placeholder.
 */
export const WithDefaultValue: Story = {
	render: () => (
		<Select defaultValue="warning">
			<SelectTrigger aria-label="Log level" className="w-44">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All levels</SelectItem>
				<SelectItem value="info">Info</SelectItem>
				<SelectItem value="warning">Warning</SelectItem>
				<SelectItem value="error">Error</SelectItem>
			</SelectContent>
		</Select>
	),
};

// ─── Open (snapshot) ─────────────────────────────────────────────────────────

/**
 * `defaultOpen` renders the popup expanded so the item list — including the
 * check indicator on the selected row — is visible in a static snapshot.
 */
export const Open: Story = {
	parameters: {
		docs: {
			story: {
				inline: false,
				iframeHeight: 380,
			},
		},
	},
	render: () => (
		<div className="h-72">
			<Select defaultOpen defaultValue="production">
				<SelectTrigger aria-label="Environment" className="w-56">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="production">Production</SelectItem>
					<SelectItem value="staging">Staging</SelectItem>
					<SelectItem value="development">Development</SelectItem>
					<SelectItem value="preview">Preview</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};

// ─── Grouped ─────────────────────────────────────────────────────────────────

/**
 * `SelectGroup` + `SelectLabel` cluster related options under a heading;
 * `SelectSeparator` divides groups. Use this when the option set spans more
 * than one logical category.
 */
export const Grouped: Story = {
	render: () => (
		<div className="h-96">
			<Select defaultValue="zenml-eu-central">
				<SelectTrigger aria-label="Region" className="w-64">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Europe</SelectLabel>
						<SelectItem value="zenml-eu-central">zenml-eu-central</SelectItem>
						<SelectItem value="zenml-eu-west">zenml-eu-west</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>North America</SelectLabel>
						<SelectItem value="zenml-us-east">zenml-us-east</SelectItem>
						<SelectItem value="zenml-us-west">zenml-us-west</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	),
};

// ─── With icons ──────────────────────────────────────────────────────────────

/**
 * Items may carry a leading icon. The trigger mirrors the selected item's icon
 * via a render-function `SelectValue` child, keyed off the chosen value.
 */
export const WithIcons: Story = {
	render: () => {
		const icons: Record<string, React.ReactNode> = {
			postgres: <Database className="size-4" />,
			repo: <FolderGit2 className="size-4" />,
			branch: <GitBranch className="size-4" />,
		};
		return (
			<div className="h-72">
				<Select defaultValue="postgres">
					<SelectTrigger aria-label="Resource type" className="w-60">
						<SelectValue>
							{(value: string) => (
								<>
									{icons[value]}
									<span className="capitalize">{value}</span>
								</>
							)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="postgres">
							<Database className="size-4" /> Postgres
						</SelectItem>
						<SelectItem value="repo">
							<FolderGit2 className="size-4" /> Repository
						</SelectItem>
						<SelectItem value="branch">
							<GitBranch className="size-4" /> Branch
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		);
	},
};

// ─── States ──────────────────────────────────────────────────────────────────

/**
 * The trigger's disabled state dims it and blocks interaction. Individual items
 * can also be disabled (`disabled` on `SelectItem`) — shown in the open popup.
 */
export const States: Story = {
	render: () => (
		<div className="flex items-start gap-3">
			<Select disabled defaultValue="production">
				<SelectTrigger aria-label="Environment (disabled)" className="w-44">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="production">Production</SelectItem>
				</SelectContent>
			</Select>
			<div className="h-64">
				<Select defaultValue="info">
					<SelectTrigger aria-label="Log level" className="w-44">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="info">Info</SelectItem>
						<SelectItem value="warning">Warning</SelectItem>
						<SelectItem value="error" disabled>
							Error (no access)
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	),
};

// ─── Long values ─────────────────────────────────────────────────────────────

/**
 * Long item labels truncate to a single line in the trigger (`line-clamp-1` is
 * built into `SelectValue`'s slot) while the popup shows them in full. Keep the
 * trigger width fixed so layout stays stable.
 */
export const LongValues: Story = {
	render: () => (
		<Select defaultValue="full">
			<SelectTrigger aria-label="Trace name" className="w-56">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="full">
					production-traces-eu-central-customer-facing
				</SelectItem>
				<SelectItem value="short">prod</SelectItem>
			</SelectContent>
		</Select>
	),
};

// ─── Composed: logs toolbar ──────────────────────────────────────────────────

/**
 * A realistic dense-toolbar pairing from the execution-logs view: a source
 * filter and a level filter, both `size="sm"` and fixed-width, sitting beside
 * each other the way they do above a log stream.
 */
export const Composed: Story = {
	render: () => (
		<div className="border-border flex w-fit items-center gap-2.5 rounded-lg border px-3 py-2.5">
			<Select defaultValue="all">
				<SelectTrigger size="sm" aria-label="Log source" className="w-32">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All sources</SelectItem>
					<SelectItem value="llm">LLM calls</SelectItem>
					<SelectItem value="tools">Tool calls</SelectItem>
					<SelectItem value="system">System</SelectItem>
				</SelectContent>
			</Select>
			<div className="bg-border h-5 w-px" />
			<Select defaultValue="warning">
				<SelectTrigger size="sm" aria-label="Log level" className="w-28">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="info">Info</SelectItem>
					<SelectItem value="warning">Warning</SelectItem>
					<SelectItem value="error">Error</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};
