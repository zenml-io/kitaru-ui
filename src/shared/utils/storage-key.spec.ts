import { describe, expect, it } from "vitest";
import { buildCookieKey, buildLocalStorageKey } from "./storage-key";

describe("buildCookieKey", () => {
	it("builds deterministic cookie keys with the app prefix", () => {
		expect(buildCookieKey("csrf-token")).toBe("kitaru.cookie.csrf-token");
	});
});

describe("buildLocalStorageKey", () => {
	it("builds deterministic local storage keys with the app prefix", () => {
		expect(buildLocalStorageKey("theme")).toBe("kitaru.local-storage.theme");
	});
});
