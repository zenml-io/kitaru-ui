import { describe, expect, it } from "vitest";
import { userQueryKeys } from "./user-queries";

describe("userQueryKeys", () => {
	it("keeps string scope as first segment in users root key", () => {
		expect(userQueryKeys.all("some-scope")).toEqual(["some-scope", "users"]);
	});

	it("keeps string scope as first segment in list keys", () => {
		expect(userQueryKeys.list("some-scope")).toEqual(["some-scope", "users"]);
	});

	it("keeps string scope as first segment in current-user key", () => {
		expect(userQueryKeys.current("some-scope")).toEqual([
			"some-scope",
			"current-user",
		]);
	});
});
