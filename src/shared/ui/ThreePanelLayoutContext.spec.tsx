import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	ThreePanelLayoutProvider,
	useInternalThreePanelLayoutForTest,
	useThreePanelLayout,
} from "./ThreePanelLayoutContext";

describe("ThreePanelLayoutProvider", () => {
	it("initializes leftOpen and rightOpen to true by default", () => {
		const { result } = renderHook(() => useThreePanelLayout(), {
			wrapper: ({ children }) => (
				<ThreePanelLayoutProvider>{children}</ThreePanelLayoutProvider>
			),
		});

		expect(result.current.leftOpen).toBe(true);
		expect(result.current.rightOpen).toBe(true);
	});

	it("honors initialLeftOpen and initialRightOpen props", () => {
		const { result } = renderHook(() => useThreePanelLayout(), {
			wrapper: ({ children }) => (
				<ThreePanelLayoutProvider
					initialLeftOpen={false}
					initialRightOpen={false}
				>
					{children}
				</ThreePanelLayoutProvider>
			),
		});

		expect(result.current.leftOpen).toBe(false);
		expect(result.current.rightOpen).toBe(false);
	});

	it("throws when useThreePanelLayout is called outside the provider", () => {
		expect(() => renderHook(() => useThreePanelLayout())).toThrow(
			/ThreePanelLayoutProvider/
		);
	});

	it("toggleLeft calls expand/collapse on the registered panel ref", () => {
		const expand = vi.fn();
		const collapse = vi.fn();

		const { result } = renderHook(
			() => ({
				pub: useThreePanelLayout(),
				internal: useInternalThreePanelLayoutForTest(),
			}),
			{
				wrapper: ({ children }) => (
					<ThreePanelLayoutProvider>{children}</ThreePanelLayoutProvider>
				),
			}
		);

		act(() => {
			result.current.internal.setLeftPanelApi({ expand, collapse });
			result.current.internal.setLeftAvailable(true);
		});

		act(() => {
			result.current.pub.toggleLeft(); // leftOpen was true → should collapse
		});
		expect(collapse).toHaveBeenCalledTimes(1);

		act(() => {
			// Simulate library firing onCollapse after collapse() ran.
			result.current.internal.onLeftCollapse();
		});
		expect(result.current.pub.leftOpen).toBe(false);

		act(() => {
			result.current.pub.toggleLeft(); // leftOpen is false → should expand
		});
		expect(expand).toHaveBeenCalledTimes(1);
	});
});
