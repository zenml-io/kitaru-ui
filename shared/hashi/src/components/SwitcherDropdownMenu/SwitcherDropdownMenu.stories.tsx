import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users } from "lucide-react";
import { Badge } from "@zenml/hashi/primitives/badge";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@zenml/hashi/primitives/dropdown-menu";

import { WORKSPACES } from "../../storybook/fixtures";

import { SwitcherDropdownMenu } from "./SwitcherDropdownMenu";
import { SwitcherEmpty, SwitcherRow } from "../SwitcherPill/SwitcherPill";

/**
 * `SwitcherDropdownMenu` is the content shell for breadcrumb switcher pills:
 * a context heading, an auto-focused search input, a scrollable item list
 * (rendered via a `children` render-prop that receives the live `query`),
 * and an optional footer. It is a plain panel — not an overlay — so these
 * stories render it inside a popover-style box to mirror how it appears once
 * a `SwitcherPill` dropdown is open.
 *
 * Type in the search field to drive the render-prop filtering.
 */
const meta: Meta<typeof SwitcherDropdownMenu> = {
	title: "Components/SwitcherDropdownMenu",
	component: SwitcherDropdownMenu,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=284-652",
		},
		a11y: {
			config: {
				// SwitcherDropdownMenu renders inline in a story box (not in a
				// portal-mounted Menu.Popup). The menu items need a role="menu"
				// ancestor, but the panel also contains a search input which is
				// not a valid child of role="menu". Disabling at story level; the
				// production surface is correct (items live inside Menu.Popup).
				rules: [
					{ id: "aria-required-parent", enabled: false },
					{ id: "aria-required-children", enabled: false },
				],
			},
		},
	},
	decorators: [
		// SwitcherRow / DropdownMenuItem are Base UI Menu.Items and need a
		// Menu.Root ancestor for context; production provides it via the pill's
		// DropdownMenu. The panel itself still renders inline in a styled box.
		(Story) => (
			<DropdownMenu open modal={false}>
				<div className="border-border bg-popover text-popover-foreground w-80 rounded-md border shadow-md">
					<Story />
				</div>
			</DropdownMenu>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SwitcherDropdownMenu>;

const workspaces = WORKSPACES.slice(0, 4);

/**
 * The base shell: context heading, auto-focused search, and a filtered list.
 * The render-prop receives the live query so the caller owns the filtering
 * (and the empty state).
 */
export const Default: Story = {
	render: () => (
		<SwitcherDropdownMenu contextLabel="Workspaces">
			{({ query }) => {
				const filtered = workspaces.filter((w) =>
					w.name.toLowerCase().includes(query.toLowerCase())
				);
				if (filtered.length === 0) {
					return <SwitcherEmpty noun="workspaces" query={query} />;
				}
				return filtered.map((w) => (
					<SwitcherRow
						key={w.slug}
						active={w.slug === "zenml-eu-central"}
						onSelect={() => {}}
					>
						<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
							{w.name}
						</span>
						<Badge
							variant="outline"
							className="text-2xs h-4 shrink-0 px-1.5 font-mono"
						>
							{w.version}
						</Badge>
						<span className="text-2xs text-muted-foreground flex shrink-0 items-center gap-1 tabular-nums">
							<Users className="size-3" aria-hidden />
							{w.memberCount}
						</span>
					</SwitcherRow>
				));
			}}
		</SwitcherDropdownMenu>
	),
};

/**
 * A custom `searchPlaceholder` and `searchAriaLabel` override the defaults
 * (which are derived from `contextLabel`). Use this when the noun being
 * searched differs from the heading.
 */
export const CustomSearchCopy: Story = {
	render: () => (
		<SwitcherDropdownMenu
			contextLabel="Projects"
			searchPlaceholder="Find a project by name or slug…"
			searchAriaLabel="Find a project"
		>
			{() => (
				<>
					<SwitcherRow active onSelect={() => {}}>
						<span className="text-foreground flex-1 truncate text-sm">
							default
						</span>
					</SwitcherRow>
					<SwitcherRow active={false} onSelect={() => {}}>
						<span className="text-foreground flex-1 truncate text-sm">
							fraud-detection
						</span>
					</SwitcherRow>
				</>
			)}
		</SwitcherDropdownMenu>
	),
};

/**
 * The footer slot accepts a function so it can read the live search query —
 * here a "Showing N of M" counter that updates as you type.
 */
export const WithLiveCounterFooter: Story = {
	render: () => (
		<SwitcherDropdownMenu
			contextLabel="Workspaces"
			footer={({ query }) => {
				const shown = workspaces.filter((w) =>
					w.name.toLowerCase().includes(query.toLowerCase())
				).length;
				return (
					<p className="text-2xs text-muted-foreground px-3 py-2 tabular-nums">
						Showing {shown} of {workspaces.length}
					</p>
				);
			}}
		>
			{({ query }) => {
				const filtered = workspaces.filter((w) =>
					w.name.toLowerCase().includes(query.toLowerCase())
				);
				if (filtered.length === 0) {
					return <SwitcherEmpty noun="workspaces" query={query} />;
				}
				return filtered.map((w) => (
					<SwitcherRow
						key={w.slug}
						active={w.slug === "zenml-eu-central"}
						onSelect={() => {}}
					>
						<span className="text-foreground flex-1 truncate text-sm font-medium">
							{w.name}
						</span>
					</SwitcherRow>
				));
			}}
		</SwitcherDropdownMenu>
	),
};

/**
 * `headerExtras` mounts controls next to the search input (here a sort
 * toggle), and a static `footer` node holds a fixed action row.
 */
export const WithHeaderExtrasAndFooter: Story = {
	render: () => (
		<SwitcherDropdownMenu
			contextLabel="Deployments"
			headerExtras={
				<Badge variant="secondary" className="shrink-0">
					Newest
				</Badge>
			}
			footer={
				<DropdownMenuItem
					onClick={() => {}}
					className="text-muted-foreground m-1 flex items-center gap-2.5 py-1.5"
				>
					<span className="text-sm">View all deployments</span>
				</DropdownMenuItem>
			}
		>
			{() => (
				<>
					<SwitcherRow active onSelect={() => {}}>
						<span className="text-foreground flex-1 truncate text-sm">
							content-pipeline · v12
						</span>
					</SwitcherRow>
					<DropdownMenuSeparator className="my-1" />
					<SwitcherRow active={false} onSelect={() => {}}>
						<span className="text-foreground flex-1 truncate text-sm">
							content-pipeline · v11
						</span>
					</SwitcherRow>
				</>
			)}
		</SwitcherDropdownMenu>
	),
};

/**
 * Empty state: when the render-prop's filter removes every item, callers
 * return `SwitcherEmpty`. Shown here pre-populated with a query that matches
 * nothing.
 */
export const Empty: Story = {
	render: () => (
		<SwitcherDropdownMenu contextLabel="Flows">
			{() => <SwitcherEmpty noun="flows" query="nonexistent-flow" />}
		</SwitcherDropdownMenu>
	),
};
