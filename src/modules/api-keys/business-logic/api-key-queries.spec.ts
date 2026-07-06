import { describe, expect, it } from "vitest";
import { apiKeyQueryKeys } from "./api-key-queries";

describe("apiKeyQueryKeys", () => {
	it("keeps scopeKey in the first key segment", () => {
		expect(apiKeyQueryKeys.all("scope-1")).toEqual(["scope-1", "api-keys"]);
		expect(apiKeyQueryKeys.list("scope-1", "sa-1")).toEqual([
			"scope-1",
			"api-keys",
			"list",
			"sa-1",
		]);
	});
});
