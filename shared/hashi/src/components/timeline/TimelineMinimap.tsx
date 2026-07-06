import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@zenml/hashi/lib/utils";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";
import type { TimeMap } from "@zenml/hashi/lib/timeline/time-map";

interface TimelineMinimapProps {
	scrollContainer: HTMLDivElement | null;
	rows: { node: TimelineNode; depth: number }[];
	timeMap: TimeMap;
	nameColWidth: number;
}

const MIN_HEIGHT = 64;
const MAX_HEIGHT = 120;
const ROW_PITCH = 3;
const BAR_HEIGHT = 1.5;

// Static bar layer — memoized so scroll-driven state updates in the parent
// don't re-render the (potentially 100+) bar divs. Only the viewport rect
// moves on scroll.
interface MinimapBarsProps {
	rows: { node: TimelineNode; depth: number }[];
	timeMap: TimeMap;
	topOffset: number;
	pitch: number;
	barHeight: number;
}

const MinimapBars = memo(function MinimapBars({
	rows,
	timeMap,
	topOffset,
	pitch,
	barHeight,
}: MinimapBarsProps) {
	return (
		<>
			{rows.map(({ node }, i) => {
				const leftPct = timeMap.msToPct(node.startMs);
				const rightPct = timeMap.msToPct(node.startMs + node.durationMs);
				const widthPct = Math.max(rightPct - leftPct, 0.4);
				return (
					<div
						key={node.id}
						className={cn("absolute rounded-[1px]", node.colorClass)}
						style={{
							top: `${topOffset + i * pitch}px`,
							height: `${barHeight}px`,
							left: `${leftPct}%`,
							width: `${widthPct}%`,
						}}
					/>
				);
			})}
		</>
	);
});

export function TimelineMinimap({
	scrollContainer,
	rows,
	timeMap,
	nameColWidth,
}: TimelineMinimapProps) {
	const [scrollLeft, setScrollLeft] = useState(0);
	const [scrollTop, setScrollTop] = useState(0);
	const [clientWidth, setClientWidth] = useState(0);
	const [clientHeight, setClientHeight] = useState(0);
	const [scrollWidth, setScrollWidth] = useState(0);
	const [scrollHeight, setScrollHeight] = useState(0);
	const trackRef = useRef<HTMLDivElement>(null);
	const dragCleanupRef = useRef<(() => void) | null>(null);

	// Subscribe once per scrollContainer. The scroll listener handles scroll
	// events; the ResizeObserver watches both the container (for clientWidth/
	// clientHeight) and its first child (for scrollWidth/scrollHeight — the
	// child is what grows/shrinks when `zoom` resizes the waterfall content, so
	// zoom changes are picked up via the child RO without needing a separate
	// effect dependency on zoom).
	useLayoutEffect(() => {
		if (!scrollContainer) return;
		const update = () => {
			setScrollLeft(scrollContainer.scrollLeft);
			setScrollTop(scrollContainer.scrollTop);
			setClientWidth(scrollContainer.clientWidth);
			setClientHeight(scrollContainer.clientHeight);
			setScrollWidth(scrollContainer.scrollWidth);
			setScrollHeight(scrollContainer.scrollHeight);
		};
		scrollContainer.addEventListener("scroll", update, { passive: true });
		const ro = new ResizeObserver(update);
		ro.observe(scrollContainer);
		const child = scrollContainer.firstElementChild;
		if (child) ro.observe(child);
		return () => {
			scrollContainer.removeEventListener("scroll", update);
			ro.disconnect();
		};
	}, [scrollContainer]);

	useEffect(() => {
		return () => dragCleanupRef.current?.();
	}, []);

	// Map scroll metrics into the "time content" coordinate space on X
	// (the sticky name column takes nameColWidth but the time area starts after
	// it). For Y there is no sticky column, so scroll metrics translate directly.
	// Use scrollbar-style math: the viewport box's start reaches (100 - size%)
	// exactly when the container is scrolled to maxScroll, so drag/click feels
	// snappy at the edges.
	const timeContentWidth = Math.max(1, scrollWidth - nameColWidth);
	const visibleTimeWidth = Math.max(0, clientWidth - nameColWidth);
	const maxScrollX = Math.max(0, scrollWidth - clientWidth);
	const hasHorizontalOverflow = maxScrollX > 1;
	const viewportWidthPct = hasHorizontalOverflow
		? Math.max((visibleTimeWidth / timeContentWidth) * 100, 4)
		: 100;
	const scrollProgressX = hasHorizontalOverflow ? scrollLeft / maxScrollX : 0;
	const viewportLeftPct = scrollProgressX * (100 - viewportWidthPct);

	const rowsContentHeight = Math.max(1, scrollHeight);
	const maxScrollY = Math.max(0, scrollHeight - clientHeight);
	const hasVerticalOverflow = maxScrollY > 1;
	const viewportHeightPct = hasVerticalOverflow
		? Math.max((clientHeight / rowsContentHeight) * 100, 6)
		: 100;
	const scrollProgressY = hasVerticalOverflow ? scrollTop / maxScrollY : 0;
	const viewportTopPct = scrollProgressY * (100 - viewportHeightPct);

	// Pixel-based row layout: fixed thin bars, centered vertically when sparse,
	// compressed (smaller pitch) when there are too many rows to fit naturally.
	// Computed up here (above the drag/click callbacks) so those can reference
	// `barsAreaTopPx` / `barsAreaHeightPx` — the indicator and drag math align
	// to the bars, not the full track, so a tall MIN_HEIGHT with sparse rows
	// doesn't cause the viewport rect to overshoot the actual content.
	const naturalHeight = rows.length * ROW_PITCH + 8;
	const trackHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, naturalHeight));
	const isCompressed = naturalHeight > MAX_HEIGHT;
	const pitch =
		isCompressed && rows.length > 0
			? (MAX_HEIGHT - 8) / rows.length
			: ROW_PITCH;
	const barHeight = isCompressed ? Math.max(1, pitch - 1) : BAR_HEIGHT;
	const topOffset = Math.max(4, (trackHeight - rows.length * pitch) / 2);
	const barsAreaHeightPx = Math.max(1, rows.length * pitch);
	const barsAreaTopPx = topOffset;
	const viewportTopPx =
		barsAreaTopPx + (viewportTopPct / 100) * barsAreaHeightPx;
	const viewportHeightPxRender = (viewportHeightPct / 100) * barsAreaHeightPx;

	const applyScroll = (targetLeft: number, targetTop: number) => {
		if (!scrollContainer) return;
		scrollContainer.scrollTo({
			left: Math.max(0, Math.min(maxScrollX, targetLeft)),
			top: Math.max(0, Math.min(maxScrollY, targetTop)),
		});
	};

	const scrollToClientPoint = (clientX: number, clientY: number) => {
		const track = trackRef.current;
		if (!track) return;
		const rect = track.getBoundingClientRect();
		const relX = clientX - rect.left;
		// Y is rebased to the bars area (barsAreaTopPx → barsAreaTopPx + barsAreaHeightPx)
		// so clicks above/below the bars stay clamped to the actual content range.
		const relY = clientY - rect.top - barsAreaTopPx;
		const pctX = Math.max(
			0,
			Math.min(1, rect.width > 0 ? relX / rect.width : 0)
		);
		const pctY = Math.max(
			0,
			Math.min(1, barsAreaHeightPx > 0 ? relY / barsAreaHeightPx : 0)
		);
		applyScroll(
			pctX * timeContentWidth - visibleTimeWidth / 2,
			hasVerticalOverflow
				? pctY * rowsContentHeight - clientHeight / 2
				: (scrollContainer?.scrollTop ?? 0)
		);
	};

	const startDrag = (onMove: (ev: MouseEvent) => void) => {
		const cleanup = () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", cleanup);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			dragCleanupRef.current = null;
		};
		document.body.style.cursor = "grabbing";
		document.body.style.userSelect = "none";
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", cleanup);
		dragCleanupRef.current = cleanup;
	};

	const handleTrackMouseDown = (e: React.MouseEvent) => {
		if (!scrollContainer) return;
		e.preventDefault();
		scrollToClientPoint(e.clientX, e.clientY);
		startDrag((ev) => scrollToClientPoint(ev.clientX, ev.clientY));
	};

	const handleViewportMouseDown = (e: React.MouseEvent) => {
		if (!scrollContainer || !trackRef.current) return;
		e.preventDefault();
		e.stopPropagation();
		const startX = e.clientX;
		const startY = e.clientY;
		const startScrollLeft = scrollContainer.scrollLeft;
		const startScrollTop = scrollContainer.scrollTop;
		const trackRect = trackRef.current.getBoundingClientRect();
		const trackWidth = trackRect.width;
		// Scrollbar-style drag: dragging the viewport box across its available
		// travel (track minus box) should move the container exactly maxScroll.
		// X uses the full track; Y is constrained to the bars region so the
		// indicator's drag travel matches its visual travel.
		const viewportWidthPx = (trackWidth * viewportWidthPct) / 100;
		const viewportHeightPxLocal = (barsAreaHeightPx * viewportHeightPct) / 100;
		const dragRangeX = Math.max(0, trackWidth - viewportWidthPx);
		const dragRangeY = Math.max(0, barsAreaHeightPx - viewportHeightPxLocal);
		const ratioX =
			hasHorizontalOverflow && dragRangeX > 0 ? maxScrollX / dragRangeX : 0;
		const ratioY =
			hasVerticalOverflow && dragRangeY > 0 ? maxScrollY / dragRangeY : 0;
		startDrag((ev) => {
			applyScroll(
				startScrollLeft + (ev.clientX - startX) * ratioX,
				startScrollTop + (ev.clientY - startY) * ratioY
			);
		});
	};

	// Keyboard navigation — arrow keys step by 10% of the visible window on the
	// matching axis, PageUp/Down = half window (vertical), Home/End = start/end
	// (horizontal), Shift+Home/End = start/end (vertical). No role="slider"
	// because this is a scroll aid, not a value selector.
	const handleTrackKeyDown = (e: React.KeyboardEvent) => {
		if (!scrollContainer) return;
		const stepX = Math.max(8, visibleTimeWidth * 0.1);
		const stepY = Math.max(8, clientHeight * 0.1);
		const pageY = Math.max(stepY, clientHeight * 0.5);
		const sl = scrollContainer.scrollLeft;
		const st = scrollContainer.scrollTop;
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			applyScroll(sl - stepX, st);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			applyScroll(sl + stepX, st);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			applyScroll(sl, st - stepY);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			applyScroll(sl, st + stepY);
		} else if (e.key === "PageUp") {
			e.preventDefault();
			applyScroll(sl, st - pageY);
		} else if (e.key === "PageDown") {
			e.preventDefault();
			applyScroll(sl, st + pageY);
		} else if (e.key === "Home") {
			e.preventDefault();
			if (e.shiftKey) applyScroll(sl, 0);
			else applyScroll(0, st);
		} else if (e.key === "End") {
			e.preventDefault();
			if (e.shiftKey) applyScroll(sl, maxScrollY);
			else applyScroll(maxScrollX, st);
		}
	};

	if (rows.length === 0 || !scrollContainer) return null;

	return (
		<div
			className="pointer-events-auto absolute right-3 bottom-3 z-40"
			role="region"
			aria-label="Timeline minimap"
		>
			<div
				ref={trackRef}
				className="border-border bg-background/90 focus-visible:ring-primary relative w-[160px] cursor-grab overflow-hidden rounded-md border shadow-md backdrop-blur-sm outline-none select-none focus-visible:ring-2 active:cursor-grabbing"
				style={{ height: trackHeight }}
				tabIndex={0}
				onMouseDown={handleTrackMouseDown}
				onKeyDown={handleTrackKeyDown}
				role="group"
				aria-label="Scroll timeline"
			>
				<MinimapBars
					rows={rows}
					timeMap={timeMap}
					topOffset={topOffset}
					pitch={pitch}
					barHeight={barHeight}
				/>
				{/* Mouse-only drag affordance; the focusable track above is the
				    accessible interaction (aria-label on a role-less div is
				    prohibited, so this stays hidden from AT). */}
				<div
					onMouseDown={handleViewportMouseDown}
					className="ring-foreground/80 bg-foreground/10 absolute cursor-grab ring-2 active:cursor-grabbing"
					style={{
						left: `${viewportLeftPct}%`,
						width: `${viewportWidthPct}%`,
						top: `${viewportTopPx}px`,
						height: `${viewportHeightPxRender}px`,
					}}
					aria-hidden="true"
				/>
			</div>
		</div>
	);
}
