import { describe, expect, it } from "vitest";
import { paramToSortingState, sortingStateToParam } from "./sorting";

describe("sortingStateToParam", () => {
	it("returns undefined for an empty sorting state", () => {
		expect(sortingStateToParam([])).toBeUndefined();
	});

	it("serializes a descending sort", () => {
		expect(sortingStateToParam([{ id: "latest_run", desc: true }])).toBe(
			"desc:latest_run"
		);
	});

	it("serializes an ascending sort", () => {
		expect(sortingStateToParam([{ id: "name", desc: false }])).toBe("asc:name");
	});

	it("serializes only the first sort entry when multiple are present", () => {
		expect(
			sortingStateToParam([
				{ id: "created", desc: true },
				{ id: "name", desc: false },
			])
		).toBe("desc:created");
	});
});

describe("paramToSortingState", () => {
	it("returns an empty array for undefined input", () => {
		expect(paramToSortingState(undefined)).toEqual([]);
	});

	it("returns an empty array for an empty string", () => {
		expect(paramToSortingState("")).toEqual([]);
	});

	it("parses a descending sort", () => {
		expect(paramToSortingState("desc:latest_run")).toEqual([
			{ id: "latest_run", desc: true },
		]);
	});

	it("parses an ascending sort", () => {
		expect(paramToSortingState("asc:name")).toEqual([
			{ id: "name", desc: false },
		]);
	});

	it("returns an empty array for a malformed input without direction", () => {
		expect(paramToSortingState("latest_run")).toEqual([]);
	});

	it("returns an empty array for an invalid direction", () => {
		expect(paramToSortingState("ascending:latest_run")).toEqual([]);
	});
});

describe("round-trip", () => {
	it("round-trips desc:latest_run", () => {
		const state = paramToSortingState("desc:latest_run");
		expect(sortingStateToParam(state)).toBe("desc:latest_run");
	});

	it("round-trips asc:created", () => {
		const state = paramToSortingState("asc:created");
		expect(sortingStateToParam(state)).toBe("asc:created");
	});
});
