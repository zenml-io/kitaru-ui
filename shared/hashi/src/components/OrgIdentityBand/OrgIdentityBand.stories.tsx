import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrgIdentityBand } from "./OrgIdentityBand";

/**
 * `OrgIdentityBand` is the organization page header: squared org mark, name,
 * "Organization" eyebrow, and three stat slots on the right (workspaces /
 * projects / members). It composes `PageIdentityHeader` and is informational —
 * page-level actions like "New workspace" live in the global navbar.
 *
 * The org mark loads `/zenml-org-example.png`; outside the app shell that asset
 * is absent, so the mark falls back to the tinted `bg-primary` square (same
 * imageless treatment as `WorkspaceAvatar`).
 */
const meta: Meta<typeof OrgIdentityBand> = {
	title: "Components/OrgIdentityBand",
	component: OrgIdentityBand,
	parameters: {
		layout: "fullscreen",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=288-1091",
		},
	},
	args: {
		name: "ZenML",
		workspaceCount: 6,
		projectCount: 24,
		memberCount: 48,
	},
};

export default meta;
type Story = StoryObj<typeof OrgIdentityBand>;

// ─── Default (controls-driven) ───────────────────────────────────────────────

export const Default: Story = {};

// ─── Single member / single workspace ────────────────────────────────────────

/**
 * A brand-new organization: one workspace, no projects yet, a single member.
 * The stats are `tabular-nums`, so single- and triple-digit counts stay
 * vertically aligned across the cluster.
 */
export const NewOrganization: Story = {
	args: {
		name: "Acme ML",
		workspaceCount: 1,
		projectCount: 0,
		memberCount: 1,
	},
};

// ─── Large counts ────────────────────────────────────────────────────────────

/**
 * A mature organization with large counts — verifies the stat cluster holds its
 * layout as the numbers widen.
 */
export const LargeCounts: Story = {
	args: {
		name: "Globex Data Platform",
		workspaceCount: 32,
		projectCount: 187,
		memberCount: 240,
	},
};

// ─── Long name truncation ────────────────────────────────────────────────────

/**
 * The title is `line-clamp-1`, so a long organization name truncates rather
 * than pushing the stat cluster off the row.
 */
export const LongName: Story = {
	args: {
		name: "Initech Machine Learning Platform and Operations",
		workspaceCount: 12,
		projectCount: 63,
		memberCount: 95,
	},
};
