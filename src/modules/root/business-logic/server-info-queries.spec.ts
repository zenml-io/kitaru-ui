import { describe, expect, it } from "vitest";
import { serverInfoQueryKeys } from "./server-info-queries";

describe("serverInfoQueryKeys", () => {
	it("keeps scopeKey in the first key segment", () => {
		expect(serverInfoQueryKeys.all("scope-1")).toEqual([
			"scope-1",
			"server-info",
		]);
		expect(serverInfoQueryKeys.detail("scope-1")).toEqual([
			"scope-1",
			"server-info",
		]);
	});
});
