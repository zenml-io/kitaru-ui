import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import {
	OnboardingChecklist,
	OnboardingChecklistItem,
} from "./OnboardingChecklist";

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

function rerender(component: ReactNode) {
	act(() => root!.render(component));
}

afterEach(() => {
	act(() => root?.unmount());
	container?.remove();
	root = undefined;
	container = undefined;
});

function ChecklistItem({
	isActive,
	isCompleted = false,
}: {
	isActive: boolean;
	isCompleted?: boolean;
}) {
	return (
		<OnboardingChecklistItem
			index={2}
			title="Create a project"
			isActive={isActive}
			isCompleted={isCompleted}
			hasDownstreamStep={false}
		>
			<p>Project instructions</p>
		</OnboardingChecklistItem>
	);
}

describe("OnboardingChecklistItem", () => {
	it("opens an active item on first render", async () => {
		render(<ChecklistItem isActive />);

		await expect
			.element(page.getByRole("button", { name: /Create a project.*Current/ }))
			.toHaveAttribute("aria-expanded", "true");
		await expect.element(page.getByText("Project instructions")).toBeVisible();
	});

	it("opens when activity changes from false to true", async () => {
		render(<ChecklistItem isActive={false} />);
		await expect
			.element(page.getByRole("button", { name: /Create a project/ }))
			.toHaveAttribute("aria-expanded", "false");

		rerender(<ChecklistItem isActive />);

		await expect
			.element(page.getByRole("button", { name: /Create a project.*Current/ }))
			.toHaveAttribute("aria-expanded", "true");
	});

	it("closes when the active item becomes completed", async () => {
		render(<ChecklistItem isActive />);
		await expect
			.element(page.getByRole("button", { name: /Create a project.*Current/ }))
			.toHaveAttribute("aria-expanded", "true");

		rerender(<ChecklistItem isActive={false} isCompleted />);

		await expect
			.element(page.getByRole("button", { name: /Create a project.*Complete/ }))
			.toHaveAttribute("aria-expanded", "false");
	});

	it("renders a contentless completed item as a static row", async () => {
		render(
			<OnboardingChecklistItem
				index={1}
				title="Create workspace"
				isCompleted
				isActive={false}
				hasDownstreamStep={false}
			/>
		);

		await expect
			.element(
				page.getByRole("heading", { name: /Create workspace.*Complete/ })
			)
			.toBeInTheDocument();
		expect(
			page.getByRole("button", { name: /Create workspace/ }).elements()
		).toHaveLength(0);
	});

	it("allows rows with content to toggle even when completed", async () => {
		render(<ChecklistItem isActive={false} isCompleted />);
		const trigger = page.getByRole("button", {
			name: /Create a project.*Complete/,
		});

		await act(async () => trigger.click());
		await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
		await act(async () => trigger.click());
		await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("communicates status in text while keeping icons decorative", async () => {
		render(<ChecklistItem isActive />);

		await expect.element(page.getByText("Now")).toBeVisible();
		await expect.element(page.getByText("Current")).toHaveClass("sr-only");
		expect(container!.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(
			1
		);
	});

	it("renders downstream gaps as skipped instead of current", async () => {
		render(
			<OnboardingChecklistItem
				index={2}
				title="Create a project"
				isCompleted={false}
				isActive
				hasDownstreamStep
			>
				<p>Project instructions</p>
			</OnboardingChecklistItem>
		);

		const trigger = page.getByRole("button", {
			name: /Create a project.*Skipped/,
		});
		await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
		await expect.element(page.getByText("Skipped")).toBeVisible();
		expect(container!.textContent).not.toContain("Now");

		await act(async () => trigger.click());
		await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
	});
});

describe("OnboardingChecklist", () => {
	it("renders the prototype-inspired card, progress count, and row structure", async () => {
		render(
			<OnboardingChecklist
				title="Get started"
				subtitle="Complete the setup"
				itemsDone={2}
				totalItems={5}
			>
				<OnboardingChecklistItem
					index={1}
					title="Workspace"
					isCompleted
					isActive={false}
					hasDownstreamStep={false}
				/>
				<ChecklistItem isActive />
			</OnboardingChecklist>
		);

		await expect
			.element(page.getByRole("heading", { name: "Get started" }))
			.toBeVisible();
		await expect.element(page.getByText("2 of 5 complete")).toBeVisible();
		await expect
			.element(page.getByRole("progressbar", { name: "Onboarding progress" }))
			.toHaveAttribute("aria-valuenow", "40");
		expect(container!.querySelector("[data-slot='card']")).not.toBeNull();
		expect(container!.querySelectorAll("li")).toHaveLength(2);
		const statusCircles = [
			...container!.querySelectorAll("span[aria-hidden='true']"),
		];
		expect(statusCircles).toHaveLength(2);
		expect(statusCircles[0]?.querySelector("svg")).not.toBeNull();
		expect(statusCircles[1]?.textContent).toBe("2");
		expect(container!.textContent).toContain("Now");
		expect(
			container!.querySelector("[data-slot='collapsible-trigger'] svg")
		).not.toBeNull();
	});

	it("uses only semantic Hashi styling hooks", () => {
		render(
			<OnboardingChecklist title="Get started" itemsDone={0} totalItems={1}>
				<ChecklistItem isActive />
			</OnboardingChecklist>
		);

		expect(container!.innerHTML).not.toMatch(
			/@zenml-io|theme-|--zen-|(?:primary|neutral)-\d+/
		);
		expect(container!.innerHTML).toMatch(
			/bg-card|text-foreground|border-border/
		);
	});
});
