import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { IDENTITY_MEMBERS as MEMBERS } from "../../storybook/fixtures";

import { MemberAvatarStack } from "../MemberAvatarStack/MemberAvatarStack";
import {
	WorkspaceIdentityBand,
	type WorkspaceSummary,
} from "./WorkspaceIdentityBand";

const ZENML_WORKSPACE: WorkspaceSummary = {
	id: "0d95ab1c-3c6e-4a5b-9d1a-2f4e8c7b6a50",
	slug: "zenml-eu-central",
	name: "zenml-eu-central",
	type: "zenml",
	version: "0.68.1",
	status: "running",
	loginUrl: "https://zenml-eu-central.cloud.zenml.io",
	apiUrl: "https://zenml-eu-central.cloud.zenml.io/api",
};

const KITARU_WORKSPACE: WorkspaceSummary = {
	id: "7b2f9e04-51d8-4c3a-8e6f-1a9c0d5b4e72",
	slug: "kitaru-us-east",
	name: "kitaru-us-east",
	type: "kitaru",
	version: "1.4.0",
	status: "running",
	loginUrl: "https://kitaru-us-east.cloud.zenml.io",
	apiUrl: "https://kitaru-us-east.cloud.zenml.io/api",
};

/**
 * `WorkspaceIdentityBand` is the workspace page header. It composes
 * `PageIdentityHeader` with a type-anchored `WorkspaceAvatar`, the
 * type+version badge, a status dot, a member count, and a two-row action
 * cluster: the member avatars slot + ⋮ menu above, then the copyable
 * `kitaru login` command and the URL / API buttons.
 *
 * The avatar gradient is anchored to the workspace `type`, not the page brand —
 * a Kitaru workspace stays orange even on a ZenML-themed page. `memberAvatars`
 * is a slot; the container passes a `MemberAvatarStack`, as these stories do.
 */
const meta: Meta<typeof WorkspaceIdentityBand> = {
	title: "Components/WorkspaceIdentityBand",
	component: WorkspaceIdentityBand,
	parameters: {
		layout: "fullscreen",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=288-1091",
		},
	},
};

export default meta;
type Story = StoryObj<typeof WorkspaceIdentityBand>;

const manageMembersRender = <button type="button" />;

const baseArgs = {
	memberCount: 6,
	memberAvatars: <MemberAvatarStack members={MEMBERS.slice(0, 4)} />,
	cmdCopied: false,
	uuidCopied: false,
	urlCopied: false,
	onCopyCommand: () => {},
	onCopyUuid: () => {},
	onCopyUrl: () => {},
	manageMembersRender,
};

// ─── Default (ZenML, running) ────────────────────────────────────────────────

export const Default: Story = {
	args: {
		workspace: ZENML_WORKSPACE,
		...baseArgs,
	},
};

// ─── Kitaru workspace ────────────────────────────────────────────────────────

/**
 * A Kitaru-type workspace. The avatar gradient and type badge stay
 * Kitaru-orange regardless of the surrounding page brand.
 */
export const KitaruType: Story = {
	args: {
		workspace: KITARU_WORKSPACE,
		...baseArgs,
		memberCount: 4,
	},
};

// ─── Status: degraded ────────────────────────────────────────────────────────

/** Degraded health — the status dot and label reflect the workspace state. */
export const StatusDegraded: Story = {
	args: {
		workspace: { ...ZENML_WORKSPACE, status: "degraded" },
		...baseArgs,
	},
};

// ─── Status: idle ────────────────────────────────────────────────────────────

/** An idle workspace — paused / no recent activity. */
export const StatusIdle: Story = {
	args: {
		workspace: { ...ZENML_WORKSPACE, status: "idle" },
		...baseArgs,
	},
};

// ─── Upgrade available ───────────────────────────────────────────────────────

/**
 * When `upgradeAvailable` is set, a `↑ vX.Y.Z` hint appears in the meta row to
 * surface that a newer server version is ready.
 */
export const UpgradeAvailable: Story = {
	args: {
		workspace: {
			...ZENML_WORKSPACE,
			version: "0.66.0",
			upgradeAvailable: "0.68.1",
		},
		...baseArgs,
	},
};

// ─── No external URLs ────────────────────────────────────────────────────────

/**
 * A local / self-hosted workspace with no `loginUrl` or `apiUrl` — the URL and
 * API buttons are omitted, leaving just the copyable login command.
 */
export const NoExternalUrls: Story = {
	args: {
		workspace: {
			...ZENML_WORKSPACE,
			slug: "local-default",
			name: "local-default",
			loginUrl: undefined,
			apiUrl: undefined,
		},
		...baseArgs,
	},
};

// ─── Member stack overflow ───────────────────────────────────────────────────

/** More than `max` (4) members collapses the remainder into a `+N` chip. */
export const ManyMembers: Story = {
	args: {
		workspace: ZENML_WORKSPACE,
		...baseArgs,
		memberCount: MEMBERS.length,
		memberAvatars: <MemberAvatarStack members={MEMBERS} />,
	},
};

// ─── Copy command confirmed ──────────────────────────────────────────────────

/**
 * `cmdCopied: true` is the confirmation state of the inline `kitaru login`
 * command — the copy icon swaps to a success check. `urlCopied` does the same
 * for the URL button.
 */
export const CommandCopied: Story = {
	args: {
		workspace: ZENML_WORKSPACE,
		...baseArgs,
		cmdCopied: true,
	},
};

// ─── Composed: live copy interactions ────────────────────────────────────────

/**
 * A realistic workspace header wired to local state, mirroring the container:
 * copying the login command, the URL, or the UUID flips its own confirmation
 * for two seconds.
 */
export const Composed: Story = {
	render: function ComposedStory() {
		const [cmdCopied, setCmdCopied] = React.useState(false);
		const [uuidCopied, setUuidCopied] = React.useState(false);
		const [urlCopied, setUrlCopied] = React.useState(false);
		const flash = (set: (v: boolean) => void) => {
			set(true);
			window.setTimeout(() => set(false), 2000);
		};
		return (
			<WorkspaceIdentityBand
				workspace={ZENML_WORKSPACE}
				memberCount={4}
				memberAvatars={<MemberAvatarStack members={MEMBERS.slice(0, 4)} />}
				cmdCopied={cmdCopied}
				uuidCopied={uuidCopied}
				urlCopied={urlCopied}
				onCopyCommand={() => flash(setCmdCopied)}
				onCopyUuid={() => flash(setUuidCopied)}
				onCopyUrl={() => flash(setUrlCopied)}
				manageMembersRender={manageMembersRender}
			/>
		);
	},
};
