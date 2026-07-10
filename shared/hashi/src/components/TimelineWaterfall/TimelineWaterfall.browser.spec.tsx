import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import type { TimelineNode } from "@zenml/hashi/lib/timeline/types";
import { TimelineWaterfall } from "./TimelineWaterfall";

(
	globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

function render(component: ReactNode) {
	container = document.createElement("div");
	// The waterfall measures itself via ResizeObserver, so it needs real width.
	container.style.width = "1000px";
	document.body.append(container);
	root = createRoot(container);
	act(() => root!.render(component));
}

afterEach(() => {
	act(() => root?.unmount());
	container?.remove();
	root = undefined;
	container = undefined;
});

const step = (
	id: string,
	startMs: number,
	durationMs: number
): TimelineNode => ({
	id,
	label: id,
	startMs,
	durationMs,
	children: [],
	colorClass: "bg-primary",
});
const wait = (
	id: string,
	startMs: number,
	durationMs: number
): TimelineNode => ({
	...step(id, startMs, durationMs),
	collapsesToGap: true,
	gapTone: "warning",
});

// The warning-tone gap background/stripe carries an inline `width: N%`.
function gapWidthsPct(): number[] {
	if (!container) return [];
	return Array.from(
		container.querySelectorAll<HTMLElement>('[class*="bg-warning"]')
	)
		.map((el) => Number.parseFloat(el.style.width))
		.filter((n) => Number.isFinite(n));
}

const nodes = [
	step("load", 0, 1000),
	wait("w", 1000, 60_000), // 60s wait inside a 63s timeline
	step("run", 61_000, 1000),
];

const noop = () => {};

describe("TimelineWaterfall wait rendering", () => {
	it("compresses a long wait to a thin fixed-width stripe", async () => {
		render(
			<TimelineWaterfall
				nodes={nodes}
				selectedId={null}
				onSelect={noop}
				onToggle={noop}
				zoom={1}
				onZoomChange={noop}
			/>
		);
		// A 60s wait inside a 63s timeline stays a thin stripe, not a wide band.
		await expect.poll(() => gapWidthsPct().length).toBeGreaterThan(0);
		expect(Math.max(...gapWidthsPct())).toBeLessThan(10);
	});
});
