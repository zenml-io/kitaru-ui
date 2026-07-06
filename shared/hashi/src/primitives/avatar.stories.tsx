import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bot, Check, ShieldCheck } from "lucide-react";

import { getMemberTintClass } from "../lib/state-styles";

import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "./avatar";

const meta: Meta<typeof Avatar> = {
	title: "Primitives/Avatar",
	component: Avatar,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=75-2",
		},
	},
	args: {
		size: "default",
		shape: "circle",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "lg", "xl", "2xl"],
		},
		shape: {
			control: "select",
			options: ["circle", "square"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ─── Default (args-driven) ────────────────────────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<Avatar {...args}>
			<AvatarImage
				src="https://i.pravatar.cc/150?u=storybook-default"
				alt="Zuri Achermann"
			/>
			<AvatarFallback>ZA</AvatarFallback>
		</Avatar>
	),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-4">
			{(["sm", "default", "lg", "xl", "2xl"] as const).map((size) => (
				<div key={size} className="flex flex-col items-center gap-2">
					<Avatar size={size}>
						<AvatarFallback>ZA</AvatarFallback>
					</Avatar>
					<span className="text-muted-foreground font-mono text-xs">
						{size}
					</span>
				</div>
			))}
		</div>
	),
};

// ─── Shapes ───────────────────────────────────────────────────────────────────

export const Shapes: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-6">
			<div className="flex flex-col items-center gap-2">
				<Avatar size="lg" shape="circle">
					<AvatarFallback>ZA</AvatarFallback>
				</Avatar>
				<span className="text-muted-foreground font-mono text-xs">circle</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Avatar size="lg" shape="square">
					<AvatarFallback>ZA</AvatarFallback>
				</Avatar>
				<span className="text-muted-foreground font-mono text-xs">square</span>
			</div>
		</div>
	),
};

// ─── Image vs Fallback ────────────────────────────────────────────────────────

export const ImageLoaded: Story = {
	render: () => (
		<Avatar size="lg">
			<AvatarImage
				src="https://i.pravatar.cc/150?u=storybook-loaded"
				alt="Hamza Tahir"
			/>
			<AvatarFallback>HT</AvatarFallback>
		</Avatar>
	),
};

export const ImageError: Story = {
	render: () => (
		<Avatar size="lg">
			<AvatarImage src="/this-image-does-not-exist.png" alt="broken" />
			<AvatarFallback>HT</AvatarFallback>
		</Avatar>
	),
};

export const FallbackOnly: Story = {
	render: () => (
		<Avatar size="lg">
			<AvatarFallback>HT</AvatarFallback>
		</Avatar>
	),
};

// ─── Tint rotation (member colors) ───────────────────────────────────────────
// Uses getMemberTintClass directly — solid earthy tints (emerald/stone/amber/
// green/orange family) defined in state-styles.ts. Index wraps via modulo so
// any non-negative integer is safe.

const TINT_INITIALS = ["AL", "BM", "CN", "DO", "EP", "FQ"];

export const TintRotation: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-4">
			{TINT_INITIALS.map((initials, i) => (
				<div key={i} className="flex flex-col items-center gap-2">
					<Avatar size="default">
						<AvatarFallback
							className={`text-xs font-semibold ${getMemberTintClass(i)}`}
						>
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className="text-muted-foreground font-mono text-xs">{i}</span>
				</div>
			))}
		</div>
	),
};

// ─── Badge ────────────────────────────────────────────────────────────────────

export const WithBadge: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-6">
			{(["sm", "default", "lg", "xl"] as const).map((size) => (
				<div key={size} className="flex flex-col items-center gap-2">
					<Avatar size={size}>
						<AvatarFallback>ZA</AvatarFallback>
						<AvatarBadge />
					</Avatar>
					<span className="text-muted-foreground font-mono text-xs">
						{size}
					</span>
				</div>
			))}
		</div>
	),
};

export const BadgeWithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-6">
			<div className="flex flex-col items-center gap-2">
				<Avatar size="xl">
					<AvatarFallback>ZA</AvatarFallback>
					<AvatarBadge>
						<Check />
					</AvatarBadge>
				</Avatar>
				<span className="text-muted-foreground font-mono text-xs">Check</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Avatar size="xl">
					<AvatarFallback>ZA</AvatarFallback>
					<AvatarBadge>
						<ShieldCheck />
					</AvatarBadge>
				</Avatar>
				<span className="text-muted-foreground font-mono text-xs">
					ShieldCheck
				</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Avatar size="xl">
					<AvatarFallback>ZA</AvatarFallback>
					<AvatarBadge>
						<Bot />
					</AvatarBadge>
				</Avatar>
				<span className="text-muted-foreground font-mono text-xs">Bot</span>
			</div>
		</div>
	),
};

// ─── Group ────────────────────────────────────────────────────────────────────

export const Group: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Circle — 3 visible + overflow count
				</span>
				<AvatarGroup>
					<Avatar>
						<AvatarFallback className={getMemberTintClass(0)}>
							AL
						</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarFallback className={getMemberTintClass(1)}>
							BM
						</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarFallback className={getMemberTintClass(2)}>
							CN
						</AvatarFallback>
					</Avatar>
					<AvatarGroupCount shape="circle">+5</AvatarGroupCount>
				</AvatarGroup>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Square — 3 visible + overflow count
				</span>
				<AvatarGroup>
					<Avatar shape="square">
						<AvatarFallback className={`${getMemberTintClass(3)} rounded-sm`}>
							DO
						</AvatarFallback>
					</Avatar>
					<Avatar shape="square">
						<AvatarFallback className={`${getMemberTintClass(4)} rounded-sm`}>
							EP
						</AvatarFallback>
					</Avatar>
					<Avatar shape="square">
						<AvatarFallback className={`${getMemberTintClass(5)} rounded-sm`}>
							FQ
						</AvatarFallback>
					</Avatar>
					<AvatarGroupCount shape="square">+2</AvatarGroupCount>
				</AvatarGroup>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Large size
				</span>
				<AvatarGroup>
					<Avatar size="lg">
						<AvatarFallback className={getMemberTintClass(0)}>
							AL
						</AvatarFallback>
					</Avatar>
					<Avatar size="lg">
						<AvatarFallback className={getMemberTintClass(1)}>
							BM
						</AvatarFallback>
					</Avatar>
					<Avatar size="lg">
						<AvatarFallback className={getMemberTintClass(2)}>
							CN
						</AvatarFallback>
					</Avatar>
					<AvatarGroupCount>+12</AvatarGroupCount>
				</AvatarGroup>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					Small size
				</span>
				<AvatarGroup>
					<Avatar size="sm">
						<AvatarFallback
							className={`text-2xs font-semibold ${getMemberTintClass(0)}`}
						>
							AL
						</AvatarFallback>
					</Avatar>
					<Avatar size="sm">
						<AvatarFallback
							className={`text-2xs font-semibold ${getMemberTintClass(1)}`}
						>
							BM
						</AvatarFallback>
					</Avatar>
					<Avatar size="sm">
						<AvatarFallback
							className={`text-2xs font-semibold ${getMemberTintClass(2)}`}
						>
							CN
						</AvatarFallback>
					</Avatar>
					<AvatarGroupCount>+3</AvatarGroupCount>
				</AvatarGroup>
			</div>
		</div>
	),
};

// ─── Composed: user table row ─────────────────────────────────────────────────

const TEAM_MEMBERS = [
	{
		initials: "ZA",
		name: "Zuri Achermann",
		email: "zuri@zenml.io",
		role: "Owner",
		tint: 0,
	},
	{
		initials: "HT",
		name: "Hamza Tahir",
		email: "hamza@zenml.io",
		role: "Admin",
		tint: 1,
	},
	{
		initials: "AL",
		name: "Alex Lenz",
		email: "alex@zenml.io",
		role: "Member",
		tint: 2,
	},
	{
		initials: "SP",
		name: "Safoine El Khamlichi",
		email: "safoine@zenml.io",
		role: "Member",
		tint: 3,
	},
];

export const ComposedMemberRow: Story = {
	render: () => (
		<div className="border-border rounded-lg border">
			{TEAM_MEMBERS.map((m, i) => (
				<div
					key={m.email}
					className={`flex items-center gap-3 px-4 py-3 ${
						i < TEAM_MEMBERS.length - 1 ? "border-border border-b" : ""
					}`}
				>
					<Avatar size="default">
						<AvatarFallback
							className={`text-xs font-semibold ${getMemberTintClass(m.tint)}`}
						>
							{m.initials}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="text-foreground truncate text-sm font-medium">
							{m.name}
						</p>
						<p className="text-muted-foreground truncate text-xs">{m.email}</p>
					</div>
					<span className="text-muted-foreground text-xs">{m.role}</span>
				</div>
			))}
		</div>
	),
};

// ─── Composed: pipeline owner header ─────────────────────────────────────────

export const ComposedPipelineHeader: Story = {
	render: () => (
		<div className="border-border bg-card flex items-center gap-3 rounded-lg border p-4">
			<Avatar size="xl" shape="square">
				<AvatarImage
					src="https://i.pravatar.cc/150?u=storybook-pipeline"
					alt="Production traces pipeline owner"
				/>
				<AvatarFallback className="text-base font-semibold">PT</AvatarFallback>
			</Avatar>
			<div className="min-w-0">
				<p className="text-foreground text-sm font-semibold">
					production-traces
				</p>
				<p className="text-muted-foreground text-xs">
					zenml-eu-central workspace
				</p>
			</div>
			<AvatarGroup className="ml-auto">
				{TEAM_MEMBERS.slice(0, 3).map((m) => (
					<Avatar key={m.email} size="sm">
						<AvatarFallback
							className={`text-2xs font-semibold ${getMemberTintClass(m.tint)}`}
						>
							{m.initials}
						</AvatarFallback>
					</Avatar>
				))}
				<AvatarGroupCount>+1</AvatarGroupCount>
			</AvatarGroup>
		</div>
	),
};

// ─── Long initials / truncation edge case ─────────────────────────────────────

export const LongContent: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar size="default">
					<AvatarFallback>AB</AvatarFallback>
				</Avatar>
				<span className="text-muted-foreground text-xs">2 chars</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Avatar size="default">
					<AvatarFallback>ABC</AvatarFallback>
				</Avatar>
				<span className="text-muted-foreground text-xs">3 chars (clip)</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<Avatar size="default">
					<AvatarFallback>ABCDE</AvatarFallback>
				</Avatar>
				<span className="text-muted-foreground text-xs">5 chars (clip)</span>
			</div>
		</div>
	),
};
