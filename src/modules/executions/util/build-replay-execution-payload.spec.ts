import { describe, expect, it } from "vitest";
import { buildReplayExecutionPayload } from "./build-replay-execution-payload";

describe("buildReplayExecutionPayload", () => {
	it("always includes skip_successful_steps", () => {
		expect(buildReplayExecutionPayload(true)).toEqual({
			skip_successful_steps: true,
		});
		expect(buildReplayExecutionPayload(false)).toEqual({
			skip_successful_steps: false,
		});
	});

	it("omits steps_to_skip when no steps are provided", () => {
		expect(buildReplayExecutionPayload(true, undefined)).toEqual({
			skip_successful_steps: true,
		});
		expect(buildReplayExecutionPayload(true, [])).toEqual({
			skip_successful_steps: true,
		});
	});

	it("includes steps_to_skip when steps are provided", () => {
		expect(buildReplayExecutionPayload(true, ["s1", "s2"])).toEqual({
			skip_successful_steps: true,
			steps_to_skip: ["s1", "s2"],
		});
	});
});
