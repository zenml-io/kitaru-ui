import { describe, expect, it } from "vitest";
import { deviceQueryKeys } from "./device-queries";

describe("deviceQueryKeys", () => {
	it("keeps scopeKey in the first key segment", () => {
		expect(deviceQueryKeys.all("scope-1")).toEqual(["scope-1", "device"]);
		expect(deviceQueryKeys.detail("scope-1", "device-1")).toEqual([
			"scope-1",
			"device",
			"device-1",
		]);
	});
});
