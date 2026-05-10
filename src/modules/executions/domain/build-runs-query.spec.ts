import { describe, expect, it, vi, afterEach } from "vitest";
import { buildRunsQuery } from "./build-runs-query";
import type { GlobalExecutionsQueryParams } from "./global-executions-query-params";

const FIXED_NOW = new Date("2026-05-10T12:00:00.000Z");

function base(): GlobalExecutionsQueryParams {
	return {
		range: "all",
		sort: "desc:created",
		page: 1,
		pageSize: 50,
	};
}

describe("buildRunsQuery", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns only sort + pagination when no filters are set", () => {
		const q = buildRunsQuery(base());
		expect(q).toEqual({
			sort_by: "desc:created",
			page: 1,
			size: 50,
		});
	});

	it("omits status when value is 'all'", () => {
		const q = buildRunsQuery({ ...base(), status: "all" });
		expect(q.status).toBeUndefined();
	});

	it("forwards a concrete status as-is", () => {
		const q = buildRunsQuery({ ...base(), status: "failed" });
		expect(q.status).toBe("failed");
	});

	it("forwards flow/version/stack ids to pipeline_id/source_snapshot_id/stack_id", () => {
		const q = buildRunsQuery({
			...base(),
			flowId: "flow-1",
			snapshotId: "snap-1",
			stackId: "stack-1",
		});
		expect(q.pipeline_id).toBe("flow-1");
		expect(q.source_snapshot_id).toBe("snap-1");
		expect(q.stack_id).toBe("stack-1");
	});

	it("trims and prefixes search with 'contains:'", () => {
		const q = buildRunsQuery({ ...base(), search: "  hello  " });
		expect(q.name).toBe("contains:hello");
	});

	it("omits search when blank or whitespace-only", () => {
		expect(buildRunsQuery({ ...base(), search: "" }).name).toBeUndefined();
		expect(buildRunsQuery({ ...base(), search: "   " }).name).toBeUndefined();
	});

	it("maps range '24h' to created: gte:<isoNow-24h>", () => {
		vi.useFakeTimers();
		vi.setSystemTime(FIXED_NOW);
		const q = buildRunsQuery({ ...base(), range: "24h" });
		expect(q.created).toBe("gte:2026-05-09T12:00:00.000Z");
	});

	it("maps range '7d' / '30d' against the same now", () => {
		vi.useFakeTimers();
		vi.setSystemTime(FIXED_NOW);
		expect(buildRunsQuery({ ...base(), range: "7d" }).created).toBe(
			"gte:2026-05-03T12:00:00.000Z"
		);
		expect(buildRunsQuery({ ...base(), range: "30d" }).created).toBe(
			"gte:2026-04-10T12:00:00.000Z"
		);
	});

	it("omits 'created' when range is 'all'", () => {
		const q = buildRunsQuery({ ...base(), range: "all" });
		expect(q.created).toBeUndefined();
	});

	it("sets logical_operator='and' when 2+ filters are active", () => {
		const q = buildRunsQuery({
			...base(),
			status: "failed",
			flowId: "flow-1",
		});
		expect(q.logical_operator).toBe("and");
	});

	it("does not set logical_operator with 0 or 1 filters", () => {
		expect(buildRunsQuery(base()).logical_operator).toBeUndefined();
		expect(
			buildRunsQuery({ ...base(), status: "failed" }).logical_operator
		).toBeUndefined();
	});
});
