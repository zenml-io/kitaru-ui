import { describe, expect, it } from "vitest";
import { getExecutionLogsPollingInterval } from "./use-execution-logs";

describe("getExecutionLogsPollingInterval", () => {
	it("returns 3000 while execution is active", () => {
		expect(getExecutionLogsPollingInterval("running")).toBe(3000);
		expect(getExecutionLogsPollingInterval("initializing")).toBe(3000);
		expect(getExecutionLogsPollingInterval("provisioning")).toBe(3000);
		expect(getExecutionLogsPollingInterval("resuming")).toBe(3000);
	});

	it("returns false once execution has reached a terminal state", () => {
		expect(getExecutionLogsPollingInterval("completed")).toBe(false);
		expect(getExecutionLogsPollingInterval("failed")).toBe(false);
		expect(getExecutionLogsPollingInterval("stopped")).toBe(false);
		expect(getExecutionLogsPollingInterval("cached")).toBe(false);
	});

	it("returns false when the status is unknown", () => {
		expect(getExecutionLogsPollingInterval(undefined)).toBe(false);
	});
});
