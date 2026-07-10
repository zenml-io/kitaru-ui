import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, LayoutGrid, Package, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@zenml/hashi/primitives/avatar";
import { Badge } from "@zenml/hashi/primitives/badge";
import { Button } from "@zenml/hashi/primitives/button";

import { PageIdentityHeader } from "./PageIdentityHeader";

/**
 * `PageIdentityHeader` is the shared layout shell behind the org / workspace /
 * project identity bands. It owns the container, alignment, padding, and bottom
 * surface; consumers fill four slots — `avatar`, `pretitle`, `title`, `meta`,
 * and `actions` — so the three pages stay visually consistent.
 *
 * It is intentionally presentation-only: no copy-to-clipboard, no router, no
 * data. The specialized bands (`OrgIdentityBand`, `WorkspaceIdentityBand`,
 * `ProjectIdentityBandView`) compose it.
 */
const meta: Meta<typeof PageIdentityHeader> = {
	title: "Components/PageIdentityHeader",
	component: PageIdentityHeader,
	parameters: {
		layout: "fullscreen",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=288-1091",
		},
	},
	args: {
		pretitle: "Project",
		title: "production-traces",
	},
};

export default meta;
type Story = StoryObj<typeof PageIdentityHeader>;

/** A squared placeholder avatar reused across the simpler stories. */
function PlaceholderAvatar() {
	return (
		<Avatar shape="square" size="xl" aria-label="production-traces">
			<AvatarFallback className="bg-muted text-muted-foreground">
				<Package className="size-5" aria-hidden />
			</AvatarFallback>
		</Avatar>
	);
}

// ─── Default (slots filled minimally) ────────────────────────────────────────

export const Default: Story = {
	args: {
		avatar: <PlaceholderAvatar />,
	},
};

// ─── With meta ───────────────────────────────────────────────────────────────

/**
 * The `meta` slot sits inline next to the title and wraps on overflow. Use it
 * for short status / tag chips that describe the entity at a glance.
 */
export const WithMeta: Story = {
	args: {
		avatar: <PlaceholderAvatar />,
		pretitle: "Workspace",
		title: "zenml-eu-central",
		meta: (
			<>
				<Badge variant="secondary">ZenML 0.68.1</Badge>
				<span className="text-muted-foreground text-xs">Production</span>
			</>
		),
	},
};

// ─── With actions ────────────────────────────────────────────────────────────

/**
 * The `actions` slot is a right-aligned flex column, so callers can stack
 * multiple rows (a member stack above a button row, for example).
 */
export const WithActions: Story = {
	args: {
		avatar: <PlaceholderAvatar />,
		pretitle: "Project",
		title: "production-traces",
		actions: (
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm">
					Settings
				</Button>
				<Button size="sm">New pipeline</Button>
			</div>
		),
	},
};

// ─── No pretitle ─────────────────────────────────────────────────────────────

/**
 * `pretitle` is optional. Without it the title sits flush against the avatar's
 * vertical center.
 */
export const NoPretitle: Story = {
	args: {
		avatar: <PlaceholderAvatar />,
		pretitle: undefined,
		title: "data-validation",
	},
};

// ─── Long title truncation ───────────────────────────────────────────────────

/**
 * The `h1` is `line-clamp-1`, so an overly long page name truncates instead of
 * pushing the actions cluster off the row.
 */
export const LongTitle: Story = {
	args: {
		avatar: <PlaceholderAvatar />,
		pretitle: "Project",
		title:
			"feature-engineering-pipeline-v2-experimental-with-a-very-long-descriptive-name",
		meta: <Badge variant="secondary">42 pipelines</Badge>,
	},
};

// ─── Composed: stat-cluster header ───────────────────────────────────────────

/**
 * A realistic org-style header: squared brand mark, "Organization" eyebrow, and
 * three stat slots on the right. This is the shape `OrgIdentityBand` produces.
 */
export const Composed: Story = {
	args: {
		pretitle: "Organization",
		title: "ZenML",
		avatar: (
			<Avatar shape="square" size="xl" aria-label="ZenML organization">
				<AvatarFallback className="bg-primary text-primary-foreground" />
			</Avatar>
		),
		actions: (
			<div className="flex items-center gap-5 text-xs">
				<HeaderStat
					icon={<LayoutGrid className="size-3.5" aria-hidden />}
					label="Workspaces"
					value={6}
				/>
				<HeaderStat
					icon={<Box className="size-3.5" aria-hidden />}
					label="Projects"
					value={24}
				/>
				<HeaderStat
					icon={<Users className="size-3.5" aria-hidden />}
					label="Members"
					value={48}
				/>
			</div>
		),
	},
};

function HeaderStat({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
}) {
	return (
		<div className="flex flex-col items-end gap-0.5">
			<span className="text-muted-foreground text-2xs font-semibold tracking-[0.5px] uppercase">
				{label}
			</span>
			<span className="text-foreground inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
				{icon}
				{value}
			</span>
		</div>
	);
}
