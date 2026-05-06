import { describe, expect, it } from "vitest";
import { buildStepsToSkip } from "./build-steps-to-skip";

function makeStep(id: string) {
	return { id };
}

describe("buildStepsToSkip", () => {
	it("returns empty when no selected step is provided", () => {
		const steps = [makeStep("s1"), makeStep("s2"), makeStep("s3")];

		expect(buildStepsToSkip(steps)).toEqual([]);
	});

	it("returns empty when the selected step is not found", () => {
		const steps = [makeStep("s1"), makeStep("s2"), makeStep("s3")];

		expect(buildStepsToSkip(steps, "missing")).toEqual([]);
	});

	it("returns empty when the first step is selected", () => {
		const steps = [makeStep("s1"), makeStep("s2"), makeStep("s3")];

		expect(buildStepsToSkip(steps, "s1")).toEqual([]);
	});

	it("returns all previous step IDs when a middle step is selected", () => {
		const steps = [
			makeStep("s1"),
			makeStep("s2"),
			makeStep("s3"),
			makeStep("s4"),
		];

		expect(buildStepsToSkip(steps, "s3")).toEqual(["s1", "s2"]);
	});

	it("returns all previous step IDs when the last step is selected", () => {
		const steps = [makeStep("s1"), makeStep("s2"), makeStep("s3")];

		expect(buildStepsToSkip(steps, "s3")).toEqual(["s1", "s2"]);
	});
});
