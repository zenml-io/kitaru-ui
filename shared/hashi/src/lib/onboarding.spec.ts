import { describe, expect, it } from "vitest";
import { getOnboardingSetup, normalizeOnboardingProgress } from "./onboarding";

const config = {
	steps: ["project", "stack", "device", "run"] as const,
	finalStep: "finished" as const,
	implicitCompletedSteps: 1,
};

describe("getOnboardingSetup", () => {
	it("activates the first incomplete step and counts the implicit step", () => {
		const result = getOnboardingSetup([], config);

		expect(result.getItem("project")).toEqual({
			isCompleted: false,
			isActive: true,
			hasDownstreamStep: false,
		});
		expect(result.itemsDone).toBe(1);
		expect(result.totalItems).toBe(5);
		expect(result.progress).toBe(20);
	});

	it("activates steps sequentially and never activates completed steps", () => {
		const result = getOnboardingSetup(["project", "stack"], config);

		expect(result.getItem("project").isActive).toBe(false);
		expect(result.getItem("stack").isActive).toBe(false);
		expect(result.getItem("device").isActive).toBe(true);
		expect(result.getItem("run").isActive).toBe(false);
	});

	it("marks an incomplete earlier step as skipped when a later step exists", () => {
		const result = getOnboardingSetup(["stack"], config);

		expect(result.getItem("project")).toEqual({
			isCompleted: false,
			isActive: false,
			hasDownstreamStep: true,
		});
		expect(result.getItem("device").isActive).toBe(true);
		expect(result.itemsDone).toBe(3);
	});

	it("uses a final marker for completion and downstream state", () => {
		const result = getOnboardingSetup(["finished"], config);

		expect(result.isFinished).toBe(true);
		expect(result.getItem("project").hasDownstreamStep).toBe(true);
		expect(result.getItem("run").hasDownstreamStep).toBe(true);
		expect(config.steps.every((step) => !result.getItem(step).isActive)).toBe(
			true
		);
		expect(result.progress).toBe(100);
	});

	it("can finish from all configured steps when no final marker is configured", () => {
		const fallback = { ...config, finalStep: undefined };

		expect(getOnboardingSetup([...config.steps], fallback).isFinished).toBe(
			true
		);
	});

	it("ignores unknown and duplicate server values", () => {
		const result = getOnboardingSetup(
			["project", "project", "unknown"],
			config
		);

		expect(result.itemsDone).toBe(2);
		expect(result.getItem("stack").isActive).toBe(true);
		expect(result.hasItem("unknown" as "project")).toBe(false);
	});

	it("returns zero tracked progress and no active item for empty steps", () => {
		const result = getOnboardingSetup([], {
			steps: [] as const,
			implicitCompletedSteps: 0,
		});

		expect(result.itemsDone).toBe(0);
		expect(result.totalItems).toBe(0);
		expect(result.progress).toBe(0);
		expect(result.isFinished).toBe(true);
	});

	it("clamps progress to the inclusive percentage range", () => {
		expect(
			getOnboardingSetup([], {
				steps: [] as const,
				implicitCompletedSteps: -2,
			}).progress
		).toBe(0);
		expect(getOnboardingSetup(["finished"], config).progress).toBe(100);
	});
});

describe("normalizeOnboardingProgress", () => {
	it("uses the same bounded integer counts for display and percentage", () => {
		expect(normalizeOnboardingProgress(3, 2.9)).toEqual({
			itemsDone: 2,
			totalItems: 2,
			progress: 100,
		});
	});

	it("treats non-finite and negative counts as zero", () => {
		expect(
			normalizeOnboardingProgress(Number.NaN, Number.POSITIVE_INFINITY)
		).toEqual({
			itemsDone: 0,
			totalItems: 0,
			progress: 0,
		});
	});
});
