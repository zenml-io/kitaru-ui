import type { Meta, StoryObj } from "@storybook/react-vite";
import { GitBranch, Users } from "lucide-react";
import { Badge } from "@zenml/hashi/primitives/badge";
import { DropdownMenu } from "@zenml/hashi/primitives/dropdown-menu";

import { WORKSPACES } from "../../storybook/fixtures";

import {
	SlashSeparator,
	SwitcherEmpty,
	SwitcherPill,
	SwitcherRow,
} from "./SwitcherPill";
import { SwitcherDropdownMenu } from "../SwitcherDropdownMenu/SwitcherDropdownMenu";

/**
 * `SwitcherPill` is the shared breadcrumb pill: a label half + divider +
 * chevron dropdown trigger. The label can be actionable (pass `labelRender`,
 * e.g. an anchor or router `Link`) or a static `<div>` fallback. The dropdown
 * content is whatever the caller passes as `children` — usually a
 * `SwitcherDropdownMenu` shell holding `SwitcherRow`s.
 *
 * This file also covers the small siblings exported alongside it:
 * `SlashSeparator`, `SwitcherEmpty`, and `SwitcherRow`.
 */
const meta: Meta<typeof SwitcherPill> = {
	title: "Components/SwitcherPill",
	component: SwitcherPill,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=282-506",
		},
	},
};

export default meta;
type Story = StoryObj<typeof SwitcherPill>;

const workspaces = WORKSPACES.slice(0, 3);

/**
 * The actionable variant: `labelRender` makes the label half a real link.
 * Open the dropdown from the chevron half. The label keeps its own
 * `aria-label` for the navigation action; the trigger announces the switch.
 */
export const Default: Story = {
	render: () => (
		<SwitcherPill
			labelRender={<a href="#" />}
			labelAriaLabel="Go to workspace zenml-eu-central"
			triggerAriaLabel="Switch workspace. Current: zenml-eu-central"
			label={<span className="max-w-44 truncate">zenml-eu-central</span>}
		>
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
						</SwitcherRow>
					));
				}}
			</SwitcherDropdownMenu>
		</SwitcherPill>
	),
};

/**
 * Label variants. With `labelRender` the label half is interactive
 * (hover/focus affordance, navigable). Without it, the label is a static
 * `<div>` with `cursor-default` — used when the pill itself isn't a
 * navigation target, only the chevron dropdown is.
 */
export const LabelVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<span className="text-muted-foreground w-24 text-xs">Linked</span>
				<SwitcherPill
					labelRender={<a href="#" />}
					labelAriaLabel="Go to project default"
					triggerAriaLabel="Switch project. Current: default"
					label={<span className="truncate">default</span>}
				>
					<SwitcherDropdownMenu contextLabel="Projects">
						{() => (
							<SwitcherRow active onSelect={() => {}}>
								<span className="text-foreground flex-1 truncate text-sm">
									default
								</span>
							</SwitcherRow>
						)}
					</SwitcherDropdownMenu>
				</SwitcherPill>
			</div>
			<div className="flex items-center gap-3">
				<span className="text-muted-foreground w-24 text-xs">Static</span>
				<SwitcherPill
					labelAriaLabel="Project default"
					triggerAriaLabel="Switch project. Current: default"
					label={<span className="truncate">default</span>}
				>
					<SwitcherDropdownMenu contextLabel="Projects">
						{() => (
							<SwitcherRow active onSelect={() => {}}>
								<span className="text-foreground flex-1 truncate text-sm">
									default
								</span>
							</SwitcherRow>
						)}
					</SwitcherDropdownMenu>
				</SwitcherPill>
			</div>
		</div>
	),
};

/**
 * `label` accepts arbitrary children, so a pill can carry more than a name —
 * here a leading branch icon and a trailing version badge inside the label
 * half. The truncation cap keeps long names from blowing out the navbar.
 */
export const RichLabel: Story = {
	render: () => (
		<SwitcherPill
			labelRender={<a href="#" />}
			labelAriaLabel="Go to flow customer-churn-prediction"
			triggerAriaLabel="Switch flow. Current: customer-churn-prediction"
			label={
				<span className="flex items-center gap-1.5">
					<GitBranch className="text-muted-foreground size-3.5" aria-hidden />
					<span className="max-w-44 truncate">customer-churn-prediction</span>
					<Badge
						variant="outline"
						className="text-2xs h-4 shrink-0 px-1.5 font-mono"
					>
						v12
					</Badge>
				</span>
			}
		>
			<SwitcherDropdownMenu contextLabel="Flows">
				{() => (
					<SwitcherRow active onSelect={() => {}}>
						<span className="text-foreground flex-1 truncate text-sm">
							customer-churn-prediction
						</span>
					</SwitcherRow>
				)}
			</SwitcherDropdownMenu>
		</SwitcherPill>
	),
};

/**
 * Long names truncate inside the label half rather than pushing the chevron
 * trigger off-screen — the cap (`max-w-*` + `truncate`) lives on the label
 * span the caller passes.
 */
export const LongLabel: Story = {
	render: () => (
		<div className="w-72">
			<SwitcherPill
				labelRender={<a href="#" />}
				labelAriaLabel="Go to workspace"
				triggerAriaLabel="Switch workspace"
				label={
					<span className="max-w-44 truncate">
						zenml-eu-central-production-inference-cluster
					</span>
				}
			>
				<SwitcherDropdownMenu contextLabel="Workspaces">
					{() => (
						<SwitcherRow active onSelect={() => {}}>
							<span className="text-foreground flex-1 truncate text-sm">
								zenml-eu-central-production-inference-cluster
							</span>
						</SwitcherRow>
					)}
				</SwitcherDropdownMenu>
			</SwitcherPill>
		</div>
	),
};

/**
 * `SwitcherRow` is the shared row chrome for switcher dropdowns. It owns the
 * `data-active` tint and the trailing check (or equal-width spacer) so the
 * row's right edge never shifts between active and inactive states. Rendered
 * inside an open DropdownMenu root (Menu.Items need its context) but laid out
 * inline for snapshotting.
 */
export const SwitcherRows: Story = {
	render: () => (
		// SwitcherRow is a Base UI Menu.Item; the open DropdownMenu supplies the
		// Menu.Root context production gets from the pill's dropdown.
		<DropdownMenu open modal={false}>
			<div
				role="menu"
				aria-label="Workspaces"
				className="border-border bg-popover w-72 rounded-md border p-1"
			>
				<SwitcherRow active onSelect={() => {}}>
					<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
						zenml-eu-central
					</span>
					<span className="text-2xs text-muted-foreground flex shrink-0 items-center gap-1 tabular-nums">
						<Users className="size-3" aria-hidden />8
					</span>
				</SwitcherRow>
				<SwitcherRow active={false} onSelect={() => {}}>
					<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
						zenml-us-east
					</span>
					<span className="text-2xs text-muted-foreground flex shrink-0 items-center gap-1 tabular-nums">
						<Users className="size-3" aria-hidden />5
					</span>
				</SwitcherRow>
				<SwitcherRow active={false} onSelect={() => {}}>
					<span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
						research-sandbox
					</span>
					<span className="text-2xs text-muted-foreground flex shrink-0 items-center gap-1 tabular-nums">
						<Users className="size-3" aria-hidden />2
					</span>
				</SwitcherRow>
			</div>
		</DropdownMenu>
	),
};

/**
 * `SwitcherEmpty` — the standard "no matches" copy a switcher dropdown shows
 * when the search query filters everything out.
 */
export const Empty: Story = {
	render: () => (
		<div className="border-border bg-popover w-72 rounded-md border">
			<SwitcherEmpty noun="workspaces" query="staging" />
		</div>
	),
};

/**
 * `SlashSeparator` — the punctuation rendered between adjacent breadcrumb
 * pills (the same component the app navbar uses). Composed here into a full
 * breadcrumb cluster of three linked pills.
 */
export const Composed: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-1">
			<SwitcherPill
				labelRender={<a href="#" />}
				labelAriaLabel="Go to workspace zenml-eu-central"
				triggerAriaLabel="Switch workspace. Current: zenml-eu-central"
				label={<span className="max-w-44 truncate">zenml-eu-central</span>}
			>
				<SwitcherDropdownMenu contextLabel="Workspaces">
					{() => (
						<SwitcherRow active onSelect={() => {}}>
							<span className="text-foreground flex-1 truncate text-sm font-medium">
								zenml-eu-central
							</span>
						</SwitcherRow>
					)}
				</SwitcherDropdownMenu>
			</SwitcherPill>
			<SlashSeparator />
			<SwitcherPill
				labelRender={<a href="#" />}
				labelAriaLabel="Go to project default"
				triggerAriaLabel="Switch project. Current: default"
				label={<span className="max-w-44 truncate">default</span>}
			>
				<SwitcherDropdownMenu contextLabel="Projects">
					{() => (
						<SwitcherRow active onSelect={() => {}}>
							<span className="text-foreground flex-1 truncate text-sm">
								default
							</span>
						</SwitcherRow>
					)}
				</SwitcherDropdownMenu>
			</SwitcherPill>
			<SlashSeparator />
			<SwitcherPill
				labelRender={<a href="#" />}
				labelAriaLabel="Go to flow customer-churn-prediction"
				triggerAriaLabel="Switch flow. Current: customer-churn-prediction"
				label={
					<span className="max-w-44 truncate">customer-churn-prediction</span>
				}
			>
				<SwitcherDropdownMenu contextLabel="Flows">
					{() => (
						<SwitcherRow active onSelect={() => {}}>
							<span className="text-foreground flex-1 truncate text-sm">
								customer-churn-prediction
							</span>
						</SwitcherRow>
					)}
				</SwitcherDropdownMenu>
			</SwitcherPill>
		</div>
	),
};
