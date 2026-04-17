import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	ThreePanelLayoutProvider,
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
});
