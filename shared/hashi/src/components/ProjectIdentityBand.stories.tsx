import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { IDENTITY_MEMBERS as MEMBERS } from "../storybook/fixtures";

import { MemberAvatarStack } from "./MemberAvatarStack";
import { ProjectIdentityBandView } from "./ProjectIdentityBand";

/**
 * `ProjectIdentityBandView` is the presentational project page header. It is the
 * `*View` half of the container/view split: the container owns copy-to-clipboard
 * state and the router link, then passes `copied`, `onCopyProjectId`, and a
 * `manageMembersRender` element down.
 *
 * The member stack and overflow menu rely on tooltips; the global preview
 * `TooltipProvider` supplies the context. In the real app `manageMembersRender`
 * is a router `<Link>`; here it is a plain element to keep the story router-free.
 */
const meta: Meta<typeof ProjectIdentityBandView> = {
	title: "Components/ProjectIdentityBand",
	component: ProjectIdentityBandView,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof ProjectIdentityBandView>;

const manageMembersRender = <button type="button" />;

// ─── Default (controlled copy state, idle) ───────────────────────────────────

export const Default: Story = {
	args: {
		name: "production-traces",
		memberAvatars: <MemberAvatarStack members={MEMBERS.slice(0, 3)} />,
		copied: false,
		onCopyProjectId: () => {},
		manageMembersRender,
	},
};

// ─── Copy ID confirmed ───────────────────────────────────────────────────────

/**
 * `copied: true` is the post-click confirmation state of the "Copy project ID"
 * menu item — the icon swaps to a success check and the label reads "Copied".
 * Open the ⋮ menu to see it.
 */
export const Copied: Story = {
	args: {
		name: "production-traces",
		memberAvatars: <MemberAvatarStack members={MEMBERS.slice(0, 3)} />,
		copied: true,
		onCopyProjectId: () => {},
		manageMembersRender,
	},
};

// ─── Member stack overflow ───────────────────────────────────────────────────

/**
 * With more than `max` (4) members the stack collapses the remainder into a
 * `+N` chip whose tooltip lists the overflow.
 */
export const ManyMembers: Story = {
	args: {
		name: "feature-store",
		memberAvatars: <MemberAvatarStack members={MEMBERS} />,
		copied: false,
		onCopyProjectId: () => {},
		manageMembersRender,
	},
};

// ─── Single member ───────────────────────────────────────────────────────────

/** A project owned by one person — no overflow chip. */
export const SingleMember: Story = {
	args: {
		name: "smoke-test",
		memberAvatars: <MemberAvatarStack members={MEMBERS.slice(0, 1)} />,
		copied: false,
		onCopyProjectId: () => {},
		manageMembersRender,
	},
};

// ─── Long name truncation ────────────────────────────────────────────────────

/**
 * A long project name truncates via the header's `line-clamp-1`, keeping the
 * member stack and overflow menu in place.
 */
export const LongName: Story = {
	args: {
		name: "feature-engineering-pipeline-v2-experimental-retraining-schedule",
		memberAvatars: <MemberAvatarStack members={MEMBERS.slice(0, 4)} />,
		copied: false,
		onCopyProjectId: () => {},
		manageMembersRender,
	},
};

// ─── Composed: live copy interaction ─────────────────────────────────────────

/**
 * A realistic end-to-end interaction: clicking "Copy project ID" flips the
 * confirmation state for two seconds, exactly as the container wires it.
 */
export const Composed: Story = {
	render: function ComposedStory() {
		const [copied, setCopied] = React.useState(false);
		return (
			<ProjectIdentityBandView
				name="production-traces"
				memberAvatars={<MemberAvatarStack members={MEMBERS.slice(0, 4)} />}
				copied={copied}
				onCopyProjectId={() => {
					setCopied(true);
					window.setTimeout(() => setCopied(false), 2000);
				}}
				manageMembersRender={manageMembersRender}
			/>
		);
	},
};
