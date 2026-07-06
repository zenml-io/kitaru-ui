import type { Meta, StoryObj } from "@storybook/react-vite";

import { MEMBERS } from "../storybook/fixtures";

import { MemberAvatarStack } from "./MemberAvatarStack";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
// Prefix slices of the canonical roster — the full 18-member superset and its
// 6- and 3-member prefixes.

const MEMBERS_SMALL = MEMBERS.slice(0, 3);
const MEMBERS_MEDIUM = MEMBERS.slice(0, 6);
const MEMBERS_LARGE = MEMBERS;

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof MemberAvatarStack> = {
	title: "Components/MemberAvatarStack",
	component: MemberAvatarStack,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=91-5",
		},
	},
	args: {
		members: MEMBERS_MEDIUM,
		max: 4,
		size: "sm",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default"],
		},
		max: {
			control: { type: "number", min: 1 },
		},
	},
};

export default meta;
type Story = StoryObj<typeof MemberAvatarStack>;

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = {};

// ─── Max cap — no overflow ────────────────────────────────────────────────────
// When max >= members.length, all avatars are shown and no +N chip renders.

export const NoOverflow: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					3 members, max 4 — no overflow chip
				</p>
				<MemberAvatarStack members={MEMBERS_SMALL} max={4} />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					6 members, max 8 — all visible
				</p>
				<MemberAvatarStack members={MEMBERS_MEDIUM} max={8} />
			</div>
		</div>
	),
};

// ─── Overflow chip ────────────────────────────────────────────────────────────
// When members.length exceeds max, the remaining count collapses into a +N chip.
// Hovering the chip shows a tooltip listing the hidden members.

export const WithOverflow: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					6 members, max 4 — shows +2 chip
				</p>
				<MemberAvatarStack members={MEMBERS_MEDIUM} max={4} />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					18 members, max 4 — shows +14 chip
				</p>
				<MemberAvatarStack members={MEMBERS_LARGE} max={4} />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					18 members, max 1 — shows +17 chip
				</p>
				<MemberAvatarStack members={MEMBERS_LARGE} max={1} />
			</div>
		</div>
	),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────
// "sm" (default) renders 24px avatars; "default" renders 32px avatars. Both
// use the ring-card overlap treatment.

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-5">
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					size sm (24px) — production-traces workspace
				</p>
				<MemberAvatarStack members={MEMBERS_MEDIUM} max={4} size="sm" />
			</div>
			<div>
				<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
					size default (32px) — production-traces workspace
				</p>
				<MemberAvatarStack members={MEMBERS_MEDIUM} max={4} size="default" />
			</div>
		</div>
	),
};

// ─── Tint rotation ────────────────────────────────────────────────────────────
// Shows all 6 tint slots together so you can verify the color cycle in context.
// Tints are earthy/solid — not pastel — to maintain contrast on dark surfaces.

export const TintRotation: Story = {
	render: () => (
		<div className="space-y-3">
			<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
				6 members — one per tint slot (0–5)
			</p>
			<MemberAvatarStack members={MEMBERS_MEDIUM} max={6} size="default" />
		</div>
	),
};

// ─── Single member ────────────────────────────────────────────────────────────
// Edge case: exactly one member. No group ring, no +N chip.

export const SingleMember: Story = {
	render: () => (
		<MemberAvatarStack members={MEMBERS_SMALL.slice(0, 1)} max={4} />
	),
};

// ─── Empty members ────────────────────────────────────────────────────────────
// When members is empty the component renders null (nothing visible).
// This story documents the contract rather than showing anything.

export const Empty: Story = {
	render: () => (
		<div className="border-border rounded-lg border px-4 py-3">
			<p className="text-muted-foreground mb-3 text-xs">
				MemberAvatarStack with 0 members renders nothing (null):
			</p>
			<MemberAvatarStack members={[]} max={4} />
			<p className="text-muted-foreground mt-3 font-mono text-xs">
				[empty — intentional]
			</p>
		</div>
	),
};

// ─── Composed: pipeline header row ───────────────────────────────────────────
// Real-world usage: the stack sits in a card header next to a pipeline name.
// The max is kept at 4 to stay within the tight horizontal budget.

export const ComposedPipelineHeader: Story = {
	render: () => (
		<div className="border-border bg-card flex w-96 items-center gap-3 rounded-lg border p-4">
			<div className="min-w-0 flex-1">
				<p className="text-foreground truncate text-sm font-semibold">
					production-traces
				</p>
				<p className="text-muted-foreground truncate text-xs">
					zenml-eu-central workspace
				</p>
			</div>
			<MemberAvatarStack members={MEMBERS_MEDIUM} max={4} size="sm" />
		</div>
	),
};

// ─── Composed: workspace list rows ───────────────────────────────────────────
// Multiple rows in a table/list, each with a different member count and max.

export const ComposedWorkspaceList: Story = {
	render: () => (
		<div className="border-border divide-border w-96 divide-y rounded-lg border">
			{[
				{ name: "production-traces", members: MEMBERS_LARGE, max: 4 },
				{ name: "staging-pipeline", members: MEMBERS_MEDIUM, max: 4 },
				{ name: "research-lab", members: MEMBERS_SMALL, max: 4 },
			].map((row) => (
				<div key={row.name} className="flex items-center gap-3 px-4 py-3">
					<p className="text-foreground flex-1 truncate text-sm font-medium">
						{row.name}
					</p>
					<MemberAvatarStack members={row.members} max={row.max} size="sm" />
				</div>
			))}
		</div>
	),
};
