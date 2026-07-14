import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader2 } from "lucide-react";

import { Badge } from "@zenml/hashi/primitives/badge";
import { Separator } from "@zenml/hashi/primitives/separator";

import { ProvenanceStrip, type ProvenanceStat } from "./ProvenanceStrip";

const REPLAY_STATS: ProvenanceStat[] = [
	{ label: "Reused", value: "6 of 8" },
	{ label: "Saved", value: "3m 12s" },
	{
		label: "Cost",
		value: "$0.46",
		delta: { label: "-$0.98", tone: "success" },
	},
];

const ORIGINAL_STATS: ProvenanceStat[] = [{ label: "Replays", value: "2" }];

const meta: Meta<typeof ProvenanceStrip> = {
	title: "Components/ProvenanceStrip",
	component: ProvenanceStrip,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=416-1335",
		},
	},
	args: {
		role: "replay",
		source: "#151",
		stats: REPLAY_STATS,
	},
};

export default meta;
type Story = StoryObj<typeof ProvenanceStrip>;

export const Default: Story = {};

/**
 * The original variant: no source link, just the role label and a single
 * "replays" stat counting how many replay executions descend from this one.
 */
export const Original: Story = {
	args: {
		role: "original",
		source: undefined,
		stats: ORIGINAL_STATS,
	},
};

/**
 * `source` lets the consuming app pass a real navigational element (react-router
 * `Link`, a plain anchor, ...) already rendered with its own text, without hashi
 * ever importing routing code.
 */
export const WithSourceLink: Story = {
	args: {
		source: <a href="#execution-151">#151</a>,
	},
};

/**
 * Realistic composed header row: mono execution id, a warning status badge,
 * a vertical separator, then the provenance strip — mirrors how the
 * execution detail header assembles its left cluster, hashi primitives only.
 */
export const ComposedHeader: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<h1 className="text-foreground font-mono text-lg font-semibold">
				#152
			</h1>
			<Badge variant="warning" emphasis="light" radius="full">
				<Loader2 className="animate-spin" aria-hidden />
				Running
			</Badge>
			<Separator orientation="vertical" className="h-5" />
			<ProvenanceStrip role="replay" source="#151" stats={REPLAY_STATS} />
		</div>
	),
};
