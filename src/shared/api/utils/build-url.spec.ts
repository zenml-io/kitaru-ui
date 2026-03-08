import { describe, expect, it } from "vitest";

import { buildUrlWithQueries } from "./build-url";

describe("buildUrlWithQueries", () => {
	it("appends query parameters when values are provided", () => {
		const result = buildUrlWithQueries("/api/runs", {
			page: 2,
			sort: "created_desc",
		});

		expect(result).toBe("/api/runs?page=2&sort=created_desc");
	});

	it("returns the original url when all provided values are nullish", () => {
		const result = buildUrlWithQueries("/api/runs", {
			ignoreNull: null,
			ignoreUndefined: undefined,
		});

		expect(result).toBe("/api/runs");
	});

	it("returns the original url when params are empty", () => {
		const result = buildUrlWithQueries("/api/runs", {});

		expect(result).toBe("/api/runs");
	});

	it("encodes special characters in query values", () => {
		const result = buildUrlWithQueries("/api/runs", {
			text: "a b&c=d?",
			emoji: "hello🙂",
		});

		expect(result).toBe(
			"/api/runs?text=a+b%26c%3Dd%3F&emoji=hello%F0%9F%99%82"
		);
	});

	it("repeats the same query key for array values", () => {
		const result = buildUrlWithQueries("/api/runs", {
			tags: ["active", "favorite"],
		});

		expect(result).toBe("/api/runs?tags=active&tags=favorite");
	});

	it("skips nullish values inside arrays", () => {
		const result = buildUrlWithQueries("/api/runs", {
			tags: ["active", null, undefined, "favorite"],
		});

		expect(result).toBe("/api/runs?tags=active&tags=favorite");
	});

	it("handles an empty base url", () => {
		const result = buildUrlWithQueries("", {
			page: 2,
		});

		expect(result).toBe("?page=2");
	});

	it("returns deterministic output for same input", () => {
		const url = "/api/runs";
		const params = { page: 2, sort: "created_desc" };

		expect(buildUrlWithQueries(url, params)).toBe(
			buildUrlWithQueries(url, params)
		);
	});
});
