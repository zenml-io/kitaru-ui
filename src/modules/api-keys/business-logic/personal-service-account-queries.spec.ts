import { describe, expect, it } from "vitest";
import { personalServiceAccountQueryKeys } from "./personal-service-account-queries";

describe("personalServiceAccountQueryKeys", () => {
	it("keeps scopeKey in the first key segment", () => {
		expect(personalServiceAccountQueryKeys.all("scope-1")).toEqual([
			"scope-1",
			"personal-service-account",
		]);
		expect(
			personalServiceAccountQueryKeys.resolve("scope-1", "user-1")
		).toEqual(["scope-1", "personal-service-account", "user-1"]);
	});
});
