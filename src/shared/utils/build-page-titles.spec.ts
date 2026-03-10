import { describe, expect, it } from "vitest";

import { buildPageTitles } from "./build-page-titles";

describe("buildPageTitles", () => {
	it("appends the app suffix to a page title", () => {
		expect(buildPageTitles("Login")).toBe("Login - Kitaru");
	});

	it("supports multi-word titles", () => {
		expect(buildPageTitles("Activate Server")).toBe("Activate Server - Kitaru");
	});

	it("keeps punctuation and symbols unchanged", () => {
		expect(buildPageTitles("Runs / Daily (v2)")).toBe(
			"Runs / Daily (v2) - Kitaru"
		);
	});

	it("handles an empty title consistently", () => {
		expect(buildPageTitles("")).toBe(" - Kitaru");
	});
});
