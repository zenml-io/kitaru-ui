import { useLayoutEffect, useState } from "react";
import { buildTicks } from "@zenml/hashi/lib/timeline/ticks";
import type { TimeMap } from "@zenml/hashi/lib/timeline/time-map";

interface TimelineAxisProps {
	timeMap: TimeMap;
	rightPadPx?: number;
	leftPadPx?: number;
}

export function TimelineAxis({
	timeMap,
	rightPadPx = 80,
	leftPadPx = 0,
}: TimelineAxisProps) {
	// Callback ref + el state so the ResizeObserver re-attaches whenever the
	// div actually mounts. A useRef + useLayoutEffect with `[]` deps would only
	// measure once at mount — which fails when the component first renders with
	// an invalid timeMap (early-returns before the div), leaving containerWidth
	// stuck at 0 even after the parent supplies valid data.
	const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
	const [containerWidth, setContainerWidth] = useState(0);

	useLayoutEffect(() => {
		if (!containerEl) return;
		const update = () => setContainerWidth(containerEl.clientWidth);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(containerEl);
		return () => ro.disconnect();
	}, [containerEl]);

	if (timeMap.totalMs === 0) return null;
	if (timeMap.pctToMs(100) <= timeMap.pctToMs(0)) return null;

	const markers = buildTicks(timeMap, containerWidth);

	return (
		<div
			ref={setContainerEl}
			className="text-2xs text-muted-foreground relative h-5 flex-1 font-mono tabular-nums"
			style={{ marginLeft: leftPadPx, marginRight: rightPadPx }}
		>
			{markers.map((marker, i) => {
				const isFirst = marker.pct <= 0.01;
				const isLast = marker.pct >= 99.99;
				return (
					<span
						key={`${marker.ms}-${i}`}
						className="absolute top-0 whitespace-nowrap"
						style={{
							left: `${marker.pct}%`,
							transform: isFirst
								? "translateX(0)"
								: isLast
									? "translateX(-100%)"
									: "translateX(-50%)",
						}}
					>
						{marker.label}
						<span className="bg-border mx-auto mt-0.5 block h-1.5 w-px" />
					</span>
				);
			})}
		</div>
	);
}
