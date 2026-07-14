import { Network, RotateCcw } from "lucide-react";

import { cn } from "@zenml/hashi/lib/utils";
import { Separator } from "@zenml/hashi/primitives/separator";

export type ProvenanceStatTone = "default" | "success" | "destructive";

export interface ProvenanceStat {
	label: string;
	value: string;
	delta?: { label: string; tone: ProvenanceStatTone };
}

export interface ProvenanceStripProps {
	role: "replay" | "original";
	/**
	 * Source execution for a replay, already rendered with its own text — a
	 * router `Link`, a plain anchor, or a bare string. Its presence flips the
	 * label to "Replay of"; omit it for a bare "Replay". Ignored when `role`
	 * is "original".
	 */
	source?: React.ReactNode;
	stats?: ProvenanceStat[];
	className?: string;
}

// Text color for the optional delta, keyed by tone. "default" renders as
// plain foreground rather than muted-foreground: on this strip's bg-muted
// surface, muted-foreground drops below AA (2.95:1 in Kitaru light).
const DELTA_TONE_CLASS: Record<ProvenanceStatTone, string> = {
	default: "text-foreground",
	success: "text-success-text",
	destructive: "text-destructive-text",
};

/**
 * Compact provenance summary for an execution detail header: what this
 * execution replays (or that it is the original), plus a handful of
 * at-a-glance stats (reuse, savings, cost, replay count, ...).
 *
 * Pure UI — the source is passed in already rendered via `source` (a router
 * `Link`, anchor, or string) so the consuming app owns navigation without
 * hashi importing react-router or any app code.
 */
export function ProvenanceStrip({
	role,
	source,
	stats = [],
	className,
}: ProvenanceStripProps) {
	const statNodes = stats.flatMap((stat, index) => {
		const nodes: React.ReactNode[] = [];
		if (index > 0) {
			nodes.push(
				<span
					key={`divider-${stat.label}`}
					aria-hidden
					className="bg-border h-4 w-px shrink-0"
				/>
			);
		}
		nodes.push(
			<div key={stat.label} className="flex items-center gap-1.5">
				<span className="text-2xs text-primary-text font-semibold tracking-wider uppercase">
					{stat.label}
				</span>
				<span className="text-foreground font-mono text-xs tabular-nums">
					{stat.value}
				</span>
				{stat.delta ? (
					<span
						className={cn(
							"text-2xs font-mono",
							DELTA_TONE_CLASS[stat.delta.tone]
						)}
					>
						{stat.delta.label}
					</span>
				) : null}
			</div>
		);
		return nodes;
	});

	return (
		<div
			className={cn(
				"bg-muted flex items-center gap-3 rounded-lg px-3 py-1",
				className
			)}
		>
			<div className="flex items-center gap-1.5">
				{role === "replay" ? (
					<>
						<RotateCcw
							className="text-primary-text size-3.5 shrink-0"
							aria-hidden
						/>
						<span className="text-foreground text-xs font-medium">
							{source ? "Replay of" : "Replay"}
						</span>
						{source ? (
							<span className="text-primary-text font-mono text-xs font-medium underline decoration-1 underline-offset-4">
								{source}
							</span>
						) : null}
					</>
				) : (
					<>
						<Network
							className="text-muted-foreground size-3.5 shrink-0"
							aria-hidden
						/>
						<span className="text-foreground text-xs font-medium">
							Original
						</span>
					</>
				)}
			</div>

			{statNodes.length > 0 ? (
				<>
					<Separator orientation="vertical" className="h-5" />
					<div className="flex items-center gap-3">{statNodes}</div>
				</>
			) : null}
		</div>
	);
}
