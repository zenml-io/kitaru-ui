import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CircleCheck } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "./avatar";

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

describe("Avatar", () => {
	it("forwards primitive props and composes consumer classes after its visual baseline", () => {
		render(
			<Avatar
				aria-label="Zuri Achermann"
				className="custom-avatar size-24"
				render={<button type="button" />}
			/>
		);

		const avatar = container!.querySelector("[data-slot=avatar]");
		expect(avatar?.tagName).toBe("BUTTON");
		expect(avatar?.getAttribute("aria-label")).toBe("Zuri Achermann");
		for (const overlayClass of [
			"after:rounded-[inherit]",
			"after:border",
			"after:border-black/10",
			"after:mix-blend-multiply",
			"dark:after:border-white/10",
			"dark:after:mix-blend-screen",
		]) {
			expect(avatar?.className).toContain(overlayClass);
		}
		expect(avatar?.className).toContain("custom-avatar");
		expect(avatar?.className.indexOf("custom-avatar")).toBeGreaterThan(
			avatar?.className.indexOf("after:rounded-[inherit]") ?? -1
		);
	});

	it.each([
		["sm", "size-6"],
		["default", "size-8"],
		["lg", "size-10"],
		["xl", "size-12"],
		["2xl", "size-20"],
	] as const)("maps the %s size to %s", (size, expectedClass) => {
		render(<Avatar size={size} />);

		const avatar = container!.querySelector("[data-slot=avatar]");
		expect(avatar?.getAttribute("data-size")).toBe(size);
		expect(avatar?.className).toContain(expectedClass);
	});

	it("forwards fallback primitive props and consumer classes", async () => {
		const handleClick = vi.fn();
		render(
			<Avatar>
				<AvatarFallback
					render={<button type="button" />}
					aria-label="Use initials"
					onClick={handleClick}
					className="custom-fallback-button"
				>
					ZA
				</AvatarFallback>
			</Avatar>
		);

		const fallback = page.getByRole("button", { name: "Use initials" });
		await fallback.click();
		expect(handleClick).toHaveBeenCalledOnce();
		const element = container!.querySelector("[data-slot=avatar-fallback]");
		expect(element?.className).toContain("custom-fallback-button");
	});

	it.each([
		["circle", "rounded-full"],
		["square", "rounded-md"],
	] as const)("maps the %s shape to its documented radius", (shape, radius) => {
		render(<Avatar size="lg" shape={shape} />);

		const avatar = container!.querySelector("[data-slot=avatar]");
		expect(avatar?.getAttribute("data-shape")).toBe(shape);
		expect(avatar?.className).toContain(radius);
	});
});

describe("Avatar image and fallback", () => {
	it("shows a loaded image, hides its fallback, and reports Base UI loading status", async () => {
		const onLoadingStatusChange = vi.fn();
		const source =
			"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'%3E%3C/svg%3E";

		render(
			<Avatar>
				<AvatarImage
					alt="Zuri Achermann"
					src={source}
					onLoadingStatusChange={onLoadingStatusChange}
					className="custom-image"
				/>
				<AvatarFallback>ZA</AvatarFallback>
			</Avatar>
		);

		await expect
			.element(page.getByRole("img", { name: "Zuri Achermann" }))
			.toBeInTheDocument();
		await vi.waitFor(() =>
			expect(onLoadingStatusChange).toHaveBeenCalledWith("loaded")
		);
		expect(container!.textContent).not.toContain("ZA");
		const image = container!.querySelector("[data-slot=avatar-image]");
		expect(image?.className).toContain("object-cover");
		expect(image?.className).toContain("rounded-[inherit]");
		expect(image?.className).toContain("custom-image");
	});

	it.each([
		["missing", undefined],
		["failed", "/avatar-image-that-does-not-exist.png"],
	] as const)(
		"shows the Base UI fallback for a %s image",
		async (_case, src) => {
			render(
				<Avatar>
					{src ? <AvatarImage alt="Unavailable avatar" src={src} /> : null}
					<AvatarFallback className="custom-fallback" data-fallback="ready">
						ZA
					</AvatarFallback>
				</Avatar>
			);

			await expect.element(page.getByText("ZA")).toBeInTheDocument();
			const fallback = container!.querySelector("[data-slot=avatar-fallback]");
			expect(fallback?.getAttribute("data-fallback")).toBe("ready");
			expect(fallback?.className).toContain("rounded-[inherit]");
			expect(fallback?.className).toContain("custom-fallback");
		}
	);
});

describe("Avatar compound components", () => {
	it.each([
		["sm", "size-2", "[&>svg]:hidden"],
		["default", "size-2.5", "[&>svg]:size-2"],
		["lg", "size-3", "[&>svg]:size-2"],
		["xl", "size-3.5", "[&>svg]:size-2.5"],
		["2xl", "size-5", "[&>svg]:size-3"],
	] as const)("scales a %s badge and its icon", (size, badgeSize, iconSize) => {
		render(
			<Avatar size={size}>
				<AvatarBadge className="custom-badge">
					<CircleCheck />
				</AvatarBadge>
			</Avatar>
		);

		const badge = container!.querySelector("[data-slot=avatar-badge]");
		expect(badge?.className).toContain(badgeSize);
		expect(badge?.className).toContain(iconSize);
		expect(badge?.className).toContain("custom-badge");
	});

	it("keeps group overlap and separation rings", () => {
		render(
			<AvatarGroup className="custom-group">
				<Avatar />
			</AvatarGroup>
		);

		const group = container!.querySelector("[data-slot=avatar-group]");
		expect(group?.className).toContain("-space-x-2");
		expect(group?.className).toContain("*:data-[slot=avatar]:ring-2");
		expect(group?.className).toContain("custom-group");
	});

	it("infers every avatar size and lets the largest mixed-group size win", () => {
		render(
			<AvatarGroup>
				{(["sm", "default", "lg", "xl", "2xl"] as const).map((size) => (
					<Avatar key={size} size={size} />
				))}
				<AvatarGroupCount className="custom-count">+5</AvatarGroupCount>
			</AvatarGroup>
		);

		const count = container!.querySelector("[data-slot=avatar-group-count]");
		expect(count?.className).toContain(
			"group-has-data-[size=sm]/avatar-group:size-6"
		);
		expect(count?.className).toContain("size-8");
		expect(count?.className).toContain(
			"group-has-data-[size=lg]/avatar-group:size-10"
		);
		expect(count?.className).toContain(
			"group-has-data-[size=xl]/avatar-group:size-12"
		);
		expect(count?.className).toContain(
			"group-has-data-[size=2xl]/avatar-group:!size-20"
		);
		expect(count?.className).toContain("custom-count");
	});

	it.each(["circle", "square"] as const)(
		"supports a %s group-count shape",
		(shape) => {
			render(<AvatarGroupCount shape={shape}>+2</AvatarGroupCount>);

			const count = container!.querySelector("[data-slot=avatar-group-count]");
			expect(count?.getAttribute("data-shape")).toBe(shape);
			expect(count?.className).toContain(
				shape === "circle" ? "rounded-full" : "data-[shape=square]:rounded-sm"
			);
		}
	);
});
