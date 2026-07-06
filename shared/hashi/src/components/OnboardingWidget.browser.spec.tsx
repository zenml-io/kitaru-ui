import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { OnboardingWidgetCard, OnboardingWidgetPill } from "./OnboardingWidget";

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

const items = [
	{ id: "done", label: "Create workspace", state: "done" as const },
	{ id: "skipped", label: "Create project", state: "skipped" as const },
	{ id: "current", label: "Create stack", state: "current" as const },
	{ id: "future", label: "Run pipeline", state: "upcoming" as const },
];

describe("OnboardingWidgetCard", () => {
	it("renders the expanded prototype contract and delegates every action", async () => {
		const onSelectStep = vi.fn();
		const onResume = vi.fn();
		const onDismiss = vi.fn();
		const onCollapse = vi.fn();
		render(
			<OnboardingWidgetCard
				title="Finish setup"
				items={items}
				itemsDone={2}
				totalItems={5}
				onSelectStep={onSelectStep}
				onResume={onResume}
				onDismiss={onDismiss}
				onCollapse={onCollapse}
			/>
		);

		await expect
			.element(page.getByRole("heading", { name: "Finish setup" }))
			.toBeVisible();
		await expect.element(page.getByText("2 of 5")).toBeVisible();
		await expect.element(page.getByText("Up next")).toBeVisible();
		await expect.element(page.getByText("Skipped")).toBeVisible();
		await expect
			.element(page.getByRole("progressbar", { name: "Setup progress" }))
			.toHaveAttribute("aria-valuenow", "40");

		await act(async () =>
			page.getByRole("button", { name: /Create project.*Skipped/ }).click()
		);
		await act(async () =>
			page.getByRole("button", { name: /Create stack/ }).click()
		);
		await act(async () =>
			page.getByRole("button", { name: "Collapse checklist" }).click()
		);
		await act(async () =>
			page.getByRole("button", { name: "Resume setup" }).click()
		);
		await act(async () =>
			page.getByRole("button", { name: "Dismiss" }).click()
		);

		expect(onSelectStep).toHaveBeenNthCalledWith(1, "skipped");
		expect(onSelectStep).toHaveBeenNthCalledWith(2, "current");
		expect(onCollapse).toHaveBeenCalledOnce();
		expect(onResume).toHaveBeenCalledOnce();
		expect(onDismiss).toHaveBeenCalledOnce();
		expect(container!.textContent).toContain("Create workspace");
		expect(container!.textContent).toContain("Run pipeline");
	});

	it("contains no router hooks or non-semantic styling hooks", () => {
		render(
			<OnboardingWidgetCard
				title="Finish setup"
				items={items}
				itemsDone={2}
				totalItems={5}
			/>
		);

		expect(container!.innerHTML).not.toMatch(
			/theme-|--zen-|(?:primary|neutral)-\d+/
		);
		expect(container!.innerHTML).toMatch(
			/bg-card|text-foreground|border-border/
		);
	});

	it("omits actions that have no handler", () => {
		render(
			<OnboardingWidgetCard
				title="Finish setup"
				items={items}
				itemsDone={2}
				totalItems={5}
			/>
		);

		expect(container!.querySelectorAll("button")).toHaveLength(0);
	});
});

describe("OnboardingWidgetPill", () => {
	it("renders a complete accessible name, ring, count, and expand control", async () => {
		const onExpand = vi.fn();
		render(
			<OnboardingWidgetPill
				title="Finish setup"
				itemsDone={2}
				totalItems={5}
				onExpand={onExpand}
			/>
		);

		const pill = page.getByRole("button", {
			name: "Finish setup, 2 of 5 complete. Expand checklist.",
		});
		await expect.element(pill).toBeVisible();
		await expect.element(page.getByText("2 of 5")).toBeVisible();
		expect(container!.querySelector("svg[aria-hidden='true']")).not.toBeNull();

		await act(async () => pill.click());
		expect(onExpand).toHaveBeenCalledOnce();
	});
});
