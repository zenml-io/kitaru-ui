import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@zenml/hashi/lib/utils";
import {
	buildTimeMap,
	type HybridSplit,
} from "@zenml/hashi/lib/timeline/time-map";
import {
	flattenNodes,
	timelineExtentMs,
} from "@zenml/hashi/lib/timeline/flatten-nodes";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";
import { GAP_TONE_STYLES } from "@zenml/hashi/lib/timeline/gap-styles";
import { TimelineAxis } from "@zenml/hashi/components/TimelineAxis";
import { TimelineRow } from "@zenml/hashi/components/TimelineRow";
import { TimelineGapStripe } from "@zenml/hashi/components/TimelineGapStripe";
import { TimelineMinimap } from "@zenml/hashi/components/TimelineMinimap";

const NAME_COL_MIN = 200;
const NAME_COL_MAX = 600;

export interface TimelineWaterfallProps {
	nodes: TimelineNode[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onToggle: (id: string) => void;
	zoom: number;
	onZoomChange: (zoom: number) => void;
	searchFilter?: string;
	zoomMin?: number;
	zoomMax?: number;
	zoomStep?: number;
	autoZoomThreshold?: number;
	idleGapPx?: number;
	defaultNameColWidth?: number;
	leftPadPx?: number;
	rightPadPx?: number;
	enableKeyboardZoom?: boolean;
	extentMsOverride?: number;
	forkMarkerMsList?: number[];
	// Two-phase axis so compared timelines share their prefix (see comparison).
	hybridSplit?: HybridSplit;
}

export function TimelineWaterfall({
	nodes,
	selectedId,
	onSelect,
	onToggle,
	zoom,
	onZoomChange,
	searchFilter = "",
	zoomMin = 1,
	zoomMax = 8,
	zoomStep = 1.5,
	autoZoomThreshold = 100,
	idleGapPx,
	defaultNameColWidth = 300,
	leftPadPx = 6,
	rightPadPx = 80,
	enableKeyboardZoom = true,
	extentMsOverride,
	forkMarkerMsList,
	hybridSplit,
}: TimelineWaterfallProps) {
	const [nameColWidth, setNameColWidth] = useState(defaultNameColWidth);
	const [waterfallWidth, setWaterfallWidth] = useState(0);
	const [waterfallNode, setWaterfallNode] = useState<HTMLDivElement | null>(
		null
	);
	const dragCleanupRef = useRef<(() => void) | null>(null);
	const autoZoomedRef = useRef(false);

	const setWaterfallRef = useCallback((node: HTMLDivElement | null) => {
		setWaterfallNode(node);
	}, []);

	useEffect(() => {
		if (!waterfallNode) return;
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const cw = entry.contentRect.width;
				if (cw > 0) setWaterfallWidth(cw);
			}
		});
		ro.observe(waterfallNode);
		return () => ro.disconnect();
	}, [waterfallNode]);

	useEffect(() => () => dragCleanupRef.current?.(), []);

	const extentMs = useMemo(() => {
		const natural = timelineExtentMs(nodes);
		return extentMsOverride !== undefined
			? Math.max(natural, extentMsOverride)
			: natural;
	}, [nodes, extentMsOverride]);

	const timeMap = useMemo(
		() =>
			buildTimeMap(
				nodes,
				extentMs,
				waterfallWidth * zoom,
				idleGapPx,
				hybridSplit
			),
		[nodes, extentMs, waterfallWidth, zoom, idleGapPx, hybridSplit]
	);

	// Rows shown in the waterfall: flattened, minus gap-collapsing nodes, which
	// render as pause stripes via timeMap.gaps. Minimap uses the same set
	// (the model is rootless, so there is no root row to additionally drop).
	const rows = useMemo(
		() =>
			flattenNodes(nodes, searchFilter).filter(
				({ node }) => !node.collapsesToGap
			),
		[nodes, searchFilter]
	);
	const flattenedCount = rows.length;

	// Auto-zoom once for dense traces. The prototype did this with render-time
	// state; because zoom is controlled here, it must run as a guarded effect.
	useEffect(() => {
		if (autoZoomedRef.current) return;
		if (flattenedCount > autoZoomThreshold && zoom === zoomMin) {
			autoZoomedRef.current = true;
			onZoomChange(2);
		}
	}, [flattenedCount, autoZoomThreshold, zoom, zoomMin, onZoomChange]);

	useEffect(() => {
		if (!enableKeyboardZoom) return;
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (
				target &&
				(target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.isContentEditable)
			) {
				return;
			}
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (e.key === "+" || e.key === "=") {
				e.preventDefault();
				onZoomChange(Math.min(zoomMax, +(zoom * zoomStep).toFixed(2)));
			} else if (e.key === "-" || e.key === "_") {
				e.preventDefault();
				onZoomChange(Math.max(zoomMin, +(zoom / zoomStep).toFixed(2)));
			} else if (e.key === "0") {
				e.preventDefault();
				onZoomChange(zoomMin);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [enableKeyboardZoom, zoom, zoomMin, zoomMax, zoomStep, onZoomChange]);

	const handleNameColDragStart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const startX = e.clientX;
		const startWidth = nameColWidth;
		const handleMouseMove = (ev: MouseEvent) => {
			const newWidth = startWidth + (ev.clientX - startX);
			setNameColWidth(Math.min(Math.max(newWidth, NAME_COL_MIN), NAME_COL_MAX));
		};
		const cleanup = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", cleanup);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			dragCleanupRef.current = null;
		};
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", cleanup);
		dragCleanupRef.current = cleanup;
	};

	return (
		<div className="relative">
			<div ref={setWaterfallRef} className="overflow-x-auto">
				<div
					className="relative flex flex-col"
					style={{ minWidth: `${zoom * 100}%` }}
				>
					<div className="border-border bg-background sticky top-0 z-30 flex items-stretch border-b">
						<div
							className="bg-background border-border sticky left-0 z-10 shrink-0 border-r"
							style={{ width: nameColWidth }}
						/>
						<div className="relative flex-1 py-1.5">
							{timeMap.gaps.length > 0 && (
								<div
									className="pointer-events-none absolute inset-0"
									style={{ marginLeft: leftPadPx, marginRight: rightPadPx }}
								>
									{timeMap.gaps.map((gap, i) => (
										<span
											key={`gap-axis-${i}`}
											className={cn(
												"absolute top-0 bottom-0",
												GAP_TONE_STYLES[gap.tone].axisBg
											)}
											style={{
												left: `${gap.startPct}%`,
												width: `${gap.endPct - gap.startPct}%`,
											}}
										/>
									))}
								</div>
							)}
							<TimelineAxis
								timeMap={timeMap}
								leftPadPx={leftPadPx}
								rightPadPx={rightPadPx}
							/>
						</div>
					</div>
					{timeMap.gaps.length > 0 && (
						<div
							className="pointer-events-none absolute top-7 bottom-0 z-0 flex"
							style={{
								left: nameColWidth + leftPadPx,
								right: rightPadPx,
							}}
						>
							<div className="relative flex-1">
								{timeMap.gaps.map((gap, i) => (
									<span
										key={`gap-bg-${i}`}
										className={cn(
											"absolute top-0 bottom-0",
											GAP_TONE_STYLES[gap.tone].rowBg
										)}
										style={{
											left: `${gap.startPct}%`,
											width: `${gap.endPct - gap.startPct}%`,
										}}
									/>
								))}
							</div>
						</div>
					)}
					<div className="relative">
						{rows.map(({ node, depth }) => (
							<TimelineRow
								key={node.id}
								node={node}
								depth={depth}
								isSelected={selectedId === node.id}
								onSelect={onSelect}
								onToggle={onToggle}
								hasChildren={node.children.length > 0}
								nameColWidth={nameColWidth}
								timeMap={timeMap}
								rightPadPx={rightPadPx}
								leftPadPx={leftPadPx}
							/>
						))}
					</div>
					{timeMap.gaps.length > 0 && (
						<div
							className="pointer-events-none absolute top-7 bottom-0 z-20 flex"
							style={{
								left: nameColWidth + leftPadPx,
								right: rightPadPx,
							}}
						>
							<div className="relative flex-1">
								{timeMap.gaps.map((gap, i) => (
									<TimelineGapStripe key={`gap-trigger-${i}`} gap={gap} />
								))}
							</div>
						</div>
					)}
					{forkMarkerMsList && forkMarkerMsList.length > 0 && (
						<div
							className="pointer-events-none absolute top-0 bottom-0 z-30 flex"
							style={{
								left: nameColWidth + leftPadPx,
								right: rightPadPx,
							}}
						>
							<div className="relative flex-1">
								{forkMarkerMsList.map((markerMs, i) => (
									<div
										key={`fork-marker-${i}-${markerMs}`}
										aria-hidden
										className="border-warning absolute top-0 bottom-0 border-l border-dashed"
										style={{ left: `${timeMap.msToPct(markerMs)}%` }}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
			<div
				className="hover:bg-primary/50 absolute top-0 bottom-0 z-40 w-px cursor-col-resize bg-transparent after:absolute after:inset-y-0 after:-right-1 after:-left-1"
				style={{ left: nameColWidth - 1 }}
				onMouseDown={handleNameColDragStart}
				role="separator"
				aria-label="Resize name column"
			/>
			{zoom > 1 && (
				<TimelineMinimap
					scrollContainer={waterfallNode}
					rows={rows}
					timeMap={timeMap}
					nameColWidth={nameColWidth}
				/>
			)}
		</div>
	);
}
