import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { WorkspaceProjectCard } from "./WorkspaceProjectCard";

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

describe("WorkspaceProjectCard", () => {
	it("renders optional footer content", async () => {
		render(
			<WorkspaceProjectCard
				name="model-training"
				path="kitaru/model-training"
				gradient="kitaru-amber"
				footerSlot={<span>kitaru project use model-training</span>}
			/>
		);

		await expect
			.element(page.getByText("kitaru project use model-training"))
			.toBeVisible();
	});

	it("omits the footer when no content is supplied", () => {
		render(
			<WorkspaceProjectCard
				name="model-training"
				path="kitaru/model-training"
				gradient="kitaru-amber"
			/>
		);

		expect(
			container!.querySelector("[data-slot='workspace-project-card']")?.children
		).toHaveLength(2);
	});
});
