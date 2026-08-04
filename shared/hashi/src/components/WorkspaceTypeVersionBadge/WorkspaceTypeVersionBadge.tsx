import {
	getWorkspaceTypeLabel,
	type WorkspaceType,
} from "@zenml/hashi/lib/state-styles";
import { cn } from "@zenml/hashi/lib/utils";

interface WorkspaceTypeVersionBadgeProps {
	type: WorkspaceType;
	version: string;
	className?: string;
}

// Split pill matching Paper artboards 7E1-0 / 743-0:
//   ┌────────┬──────────┐
//   │ ZENML  │ V0.94.1  │   ← JetBrains Mono 10px, h-5, 0.5px tracking
//   └────────┴──────────┘
// Left half = type-tinted (sage for ZenML, peach for Kitaru). Right half = a
// softer hue from the same scene with the same text + border. Colors come
// straight from the Paper artboards converted to oklch; they're type-anchored
// (a ZenML pill keeps its own colour even on a Kitaru-themed page), same
// pattern as WorkspaceAvatar — that's why Kitaru lives inline rather than as
// theme tokens. The ZenML half reads from tokens because the ZenML brand
// colour itself changes per brand (purple under the legacy zenml-pro theme).
type TagPalette = {
	bgStrong: string;
	bgSoft: string;
	border: string;
	text: string;
};

const PALETTES: Record<WorkspaceType, TagPalette> = {
	// Paper: #E1E7DE / #F5F7F4 / #D4DED0 / #7A9268 (= --zen-green-palm-leaf).
	// Tokenized because the ZenML brand colour is itself brand-dependent: the
	// legacy Pro theme restates these in purple. Kitaru below stays literal.
	zenml: {
		bgStrong: "var(--ws-tag-zenml-bg-strong)",
		bgSoft: "var(--ws-tag-zenml-bg-soft)",
		border: "var(--ws-tag-zenml-border)",
		text: "var(--ws-tag-zenml-text)",
	},
	// Paper: #F3E3D4 / #F5ECE3 / #FAD3B3 / #E28C46
	kitaru: {
		bgStrong: "oklch(0.9106 0.0276 70)",
		bgSoft: "oklch(0.9335 0.0143 67)",
		border: "oklch(0.8771 0.0567 64)",
		text: "oklch(0.5 0.1351 53)",
	},
};

export function WorkspaceTypeVersionBadge({
	type,
	version,
	className,
}: WorkspaceTypeVersionBadgeProps) {
	const p = PALETTES[type];
	// Border lives on the outer container so the rounded corners draw as a
	// single continuous stroke. The divider between halves is a single
	// `border-l` on the right segment — using per-segment borders + an outer
	// `overflow-hidden` makes the rounded corners look chipped where the inner
	// border meets the clip.
	return (
		<div
			className={cn(
				"text-2xs inline-flex h-5 items-stretch overflow-hidden rounded-sm border font-mono uppercase",
				className
			)}
			style={{ borderColor: p.border, color: p.text }}
		>
			<span
				className="flex items-center px-1.5 tracking-[0.5px]"
				style={{ backgroundColor: p.bgStrong }}
			>
				{getWorkspaceTypeLabel(type)}
			</span>
			<span
				className="flex items-center border-l px-1.5 tabular-nums"
				style={{ backgroundColor: p.bgSoft, borderLeftColor: p.border }}
			>
				V{version}
			</span>
		</div>
	);
}
