import type { Meta, StoryObj } from "@storybook/react-vite";
import { GitBranch, Workflow } from "lucide-react";

import { Badge } from "@zenml/hashi/primitives/badge";
import { Button } from "@zenml/hashi/primitives/button";

import { IdentityBand } from "./IdentityBand";

/**
 * `IdentityBand` is the tighter `bg-secondary` identity wrapper used by flow /
 * deployment detail pages. It supplies the secondary surface, bottom border,
 * and `px-8 pt-5 pb-4` padding — the caller owns everything inside.
 *
 * Distinct from `PageIdentityHeader`, which is the wider `bg-card` shell behind
 * the org / workspace / project bands.
 */
const meta: Meta<typeof IdentityBand> = {
	title: "Components/IdentityBand",
	component: IdentityBand,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof IdentityBand>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
	args: {
		children: (
			<div className="flex items-center gap-2">
				<Workflow className="text-muted-foreground size-4" aria-hidden />
				<span className="text-foreground text-lg font-semibold">
					production-traces
				</span>
			</div>
		),
	},
};

// ─── With trailing actions ───────────────────────────────────────────────────

/**
 * The band stays informational, but callers commonly pair the title with
 * right-aligned actions inside a `justify-between` row.
 */
export const WithActions: Story = {
	render: () => (
		<IdentityBand>
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Workflow className="text-muted-foreground size-4" aria-hidden />
					<span className="text-foreground text-lg font-semibold">
						nightly-finetune
					</span>
				</div>
				<Button variant="outline" size="sm">
					Run pipeline
				</Button>
			</div>
		</IdentityBand>
	),
};

// ─── Custom className passthrough ────────────────────────────────────────────

/**
 * `className` is merged onto the inner padding wrapper, so consumers can tune
 * the inset without losing the secondary surface or bottom border.
 */
export const CustomPadding: Story = {
	render: () => (
		<IdentityBand className="px-4 py-3">
			<span className="text-muted-foreground text-sm">
				Tighter padding via className
			</span>
		</IdentityBand>
	),
};

// ─── Composed: flow detail header ────────────────────────────────────────────

/**
 * A realistic deployment / flow detail header — the surface this component was
 * built for. Title, source-branch chip, and a status badge in one band.
 */
export const Composed: Story = {
	render: () => (
		<IdentityBand>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<Workflow
						className="text-muted-foreground size-5 shrink-0"
						aria-hidden
					/>
					<div className="flex min-w-0 flex-col">
						<span className="text-foreground truncate text-lg font-semibold">
							feature-engineering-pipeline
						</span>
						<span className="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-xs">
							<GitBranch className="size-3" aria-hidden />
							main · a4f1c2e
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="secondary">Deployed</Badge>
					<Button variant="outline" size="sm">
						View runs
					</Button>
				</div>
			</div>
		</IdentityBand>
	),
};
