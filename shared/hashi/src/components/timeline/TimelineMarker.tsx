import { useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "../../lib/utils";

/** Height (px) of the grip-handle lane the marker reserves above the rows. */
export const TIMELINE_MARKER_LANE_HEIGHT = 32;

export interface TimelineMarkerProps {
	/** Controlled marker position along the rail, 0-100. */
	positionPct: number;
	/** Full sentence for the grip button, e.g. "Replay start at X. Use the arrow keys to move it." */
	ariaLabel: string;
	/** Visible label rendered after the grip icon, e.g. "Start here". */
	label?: ReactNode;
	/** Raw clamped rail percentage reported during a pointer drag; the host snaps. */
	onDrag: (pct: number) => void;
	/** Arrow keys: -1 (left/up) or +1 (right/down); the host decides what a step means. */
	onStep: (delta: -1 | 1) => void;
	/** Home key. */
	onHome?: () => void;
	/** End key. */
	onEnd?: () => void;
	/** Left rail inset (px); must match the waterfall geometry (name column + left pad). */
	leftInsetPx: number;
	/** Right rail inset (px); must match the waterfall geometry (right pad). */
	rightInsetPx: number;
	/** Grip lane height (px). Keep in sync with the host's lane spacer. */
	handleLaneHeightPx?: number;
	className?: string;
}

/**
 * TimelineMarker — a generic draggable position marker for timeline surfaces:
 * a grip button in a top lane plus a dashed vertical line spanning the rows
 * below it.
 *
 * Percentage-controlled: the host owns `positionPct` (0-100 along the rail)
 * and all snapping — time→x is typically non-linear (TimeMap), so the marker
 * never converts. During a pointer drag it reports the raw clamped rail
 * percentage via `onDrag`; keyboard moves are delegated via `onStep`,
 * `onHome`, and `onEnd`.
 *
 * Host contract:
 * - Render the marker as the LAST child of a single `relative` container
 *   whose first child is a lane spacer div (height
 *   TIMELINE_MARKER_LANE_HEIGHT) followed by the timeline rows; the marker
 *   overlays that whole container.
 * - `leftInsetPx` / `rightInsetPx` must match the waterfall geometry fed to
 *   TimelineAxis / TimelineRow (name column width + horizontal padding) so
 *   the marker rail lines up with the axis rail.
 * - Assumes a non-scrolling, non-zoomed rail where percentages map 1:1 to
 *   the visible rail width — not yet valid inside the zoomable
 *   TimelineWaterfall.
 *
 * The grip is a plain button (not role="slider"): it announces its position
 * through `ariaLabel` and moves via the arrow keys, matching the shipped
 * accessibility contract.
 */
export function TimelineMarker({
	positionPct,
	ariaLabel,
	label,
	onDrag,
	onStep,
	onHome,
	onEnd,
	leftInsetPx,
	rightInsetPx,
	handleLaneHeightPx = TIMELINE_MARKER_LANE_HEIGHT,
	className,
}: TimelineMarkerProps) {
	const [dragging, setDragging] = useState(false);
	const [railEl, setRailEl] = useState<HTMLDivElement | null>(null);

	const reportClientX = (clientX: number) => {
		if (!railEl) return;
		const rect = railEl.getBoundingClientRect();
		const pct = ((clientX - rect.left) / rect.width) * 100;
		onDrag(Math.max(0, Math.min(100, pct)));
	};

	const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		// preventDefault suppresses the click's default focus; restore it so the
		// grip stays keyboard-operable (arrow keys move the marker).
		e.currentTarget.focus();
		setDragging(true);
	};
	const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
		if (dragging) reportClientX(e.clientX);
	};
	const handlePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
		if (!dragging) return;
		if (e.currentTarget.hasPointerCapture(e.pointerId))
			e.currentTarget.releasePointerCapture(e.pointerId);
		setDragging(false);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			e.preventDefault();
			onStep(-1);
		} else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			e.preventDefault();
			onStep(1);
		} else if (e.key === "Home") {
			e.preventDefault();
			onHome?.();
		} else if (e.key === "End") {
			e.preventDefault();
			onEnd?.();
		}
	};

	return (
		<div
			ref={setRailEl}
			className={cn("pointer-events-none absolute inset-y-0", className)}
			style={{ left: leftInsetPx, right: rightInsetPx }}
		>
			<div className="relative h-full">
				{/* Grip lane: the handle bottom-aligns against the first row. */}
				<div
					className="absolute inset-x-0 top-0"
					style={{ height: handleLaneHeightPx }}
				>
					<button
						type="button"
						aria-label={ariaLabel}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerUp}
						onKeyDown={handleKeyDown}
						style={{ left: `${positionPct}%` }}
						className={cn(
							"bg-primary text-primary-foreground focus-visible:ring-primary/40 pointer-events-auto absolute bottom-0 flex -translate-x-1/2 cursor-grab touch-none items-center gap-1 rounded-md px-1.5 py-1 text-xs whitespace-nowrap outline-none focus-visible:ring-3 active:cursor-grabbing",
							dragging && "cursor-grabbing"
						)}
					>
						<GripVertical className="size-3.5" aria-hidden />
						{label}
					</button>
				</div>
				{/* Dashed position line spanning the rows below the lane. */}
				<div
					className="border-primary absolute bottom-0 border-l-2 border-dashed"
					style={{ left: `${positionPct}%`, top: handleLaneHeightPx }}
				/>
			</div>
		</div>
	);
}
