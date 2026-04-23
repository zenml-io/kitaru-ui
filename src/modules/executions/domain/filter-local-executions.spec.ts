import { describe, expect, it } from "vitest";
import type { Execution } from "./execution";
import { filterLocalExecutions } from "./filter-local-executions";

function mkExecution(overrides: Partial<Execution>): Execution {
	return {
		id: "run-x",
		name: "run",
		index: 1,
		logSources: [],
		...overrides,
	};
}

describe("filterLocalExecutions", () => {
	it("keeps runs whose snapshot isn't a known Kitaru deployment", () => {
		const e1 = mkExecution({ id: "run-1", snapshotId: "snap-a" });
		const e2 = mkExecution({ id: "run-2", snapshotId: "snap-kitaru" });
		const e3 = mkExecution({ id: "run-3", snapshotId: undefined });
		const kitaruIds = new Set(["snap-kitaru"]);
		expect(filterLocalExecutions([e1, e2, e3], kitaruIds)).toEqual([e1, e3]);
	});

	it("treats a run with no snapshotId as local", () => {
		const e = mkExecution({ id: "run-1", snapshotId: undefined });
		expect(filterLocalExecutions([e], new Set())).toEqual([e]);
	});

	it("returns an empty array for an empty input", () => {
		expect(filterLocalExecutions([], new Set(["snap-a"]))).toEqual([]);
	});
});
