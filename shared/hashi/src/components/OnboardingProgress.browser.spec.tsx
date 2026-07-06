import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import {
	OnboardingProgressBar,
	OnboardingProgressRing,
} from "./OnboardingProgress";

(
	globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;

function render(component: ReactNode) {
	container = document.createElement("div");
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

describe("OnboardingProgressBar", () => {
	it("exposes a bounded percentage through progressbar semantics", async () => {
		render(<OnboardingProgressBar value={42} label="Setup progress" />);

		const progress = page.getByRole("progressbar", { name: "Setup progress" });
		await expect.element(progress).toHaveAttribute("aria-valuemin", "0");
		await expect.element(progress).toHaveAttribute("aria-valuemax", "100");
		await expect.element(progress).toHaveAttribute("aria-valuenow", "42");
	});

	it("clamps values to the inclusive percentage range", async () => {
		render(
			<>
				<OnboardingProgressBar value={-20} label="Low progress" />
				<OnboardingProgressBar value={120} label="High progress" />
			</>
		);

		await expect
			.element(page.getByRole("progressbar", { name: "Low progress" }))
			.toHaveAttribute("aria-valuenow", "0");
		await expect
			.element(page.getByRole("progressbar", { name: "High progress" }))
			.toHaveAttribute("aria-valuenow", "100");
	});
});

describe("OnboardingProgressRing", () => {
	it("clamps its arc and exposes an accessible percentage", async () => {
		render(<OnboardingProgressRing value={150} />);

		await expect
			.element(page.getByRole("img", { name: "100% complete" }))
			.toBeInTheDocument();
		const circles = container!.querySelectorAll("circle");
		expect(circles).toHaveLength(2);
		expect(circles[1]?.getAttribute("stroke-dashoffset")).toBe("0");
	});

	it("can be decorative when a parent control names the progress", () => {
		render(<OnboardingProgressRing value={30} decorative />);

		const ring = container!.querySelector("svg");
		expect(ring?.getAttribute("aria-hidden")).toBe("true");
		expect(ring?.getAttribute("role")).toBeNull();
		expect(ring?.getAttribute("aria-label")).toBeNull();
	});
});
