import { describe, expect, it, vi, afterEach } from "vitest";
import { buildExecutionsQuery } from "./build-executions-query";
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

describe("buildExecutionsQuery", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns only sort + pagination when no filters are set", () => {
		const q = buildExecutionsQuery(base());
		expect(q).toEqual({
			sort_by: "desc:created",
			page: 1,
			size: 50,
		});
	});

	it("omits status when value is 'all'", () => {
		const q = buildExecutionsQuery({ ...base(), status: "all" });
		expect(q.status).toBeUndefined();
	});

	it("forwards a concrete status as-is", () => {
		const q = buildExecutionsQuery({ ...base(), status: "failed" });
		expect(q.status).toBe("failed");
	});

	it("forwards flow/version/stack ids to pipeline_id/source_snapshot_id/stack_id", () => {
		const q = buildExecutionsQuery({
			...base(),
			flowId: "flow-1",
			snapshotId: "snap-1",
			stackId: "stack-1",
		});
		expect(q.pipeline_id).toBe("flow-1");
		expect(q.source_snapshot_id).toBe("snap-1");
		expect(q.stack_id).toBe("stack-1");
	});

	it("trims a text search and maps it to pipeline_name with 'contains:'", () => {
		const q = buildExecutionsQuery({ ...base(), search: "  namespace_flow  " });
		expect(q.pipeline_name).toBe("contains:namespace_flow");
		expect(q.index).toBeUndefined();
	});

	it("treats bare digits as a flow-name substring match", () => {
		const q = buildExecutionsQuery({ ...base(), search: "13" });
		expect(q.pipeline_name).toBe("contains:13");
		expect(q.index).toBeUndefined();
	});

	it("treats '#<digits>' as an exact index lookup", () => {
		const q = buildExecutionsQuery({ ...base(), search: "#42" });
		expect(q.index).toBe(42);
		expect(q.pipeline_name).toBeUndefined();
	});

	it("strips zero-padding from '#<digits>' (matches the displayed format)", () => {
		const q = buildExecutionsQuery({ ...base(), search: "#0013" });
		expect(q.index).toBe(13);
		expect(q.pipeline_name).toBeUndefined();
	});

	it("omits search when blank or whitespace-only", () => {
		expect(
			buildExecutionsQuery({ ...base(), search: "" }).pipeline_name
		).toBeUndefined();
		expect(
			buildExecutionsQuery({ ...base(), search: "   " }).pipeline_name
		).toBeUndefined();
		expect(
			buildExecutionsQuery({ ...base(), search: "" }).index
		).toBeUndefined();
	});

	it("maps range '24h' to created: gte:<now-24h> in backend datetime format", () => {
		vi.useFakeTimers();
		vi.setSystemTime(FIXED_NOW);
		const q = buildExecutionsQuery({ ...base(), range: "24h" });
		expect(q.created).toBe("gte:2026-05-09 12:00:00");
	});

	it("maps range '7d' / '30d' against the same now", () => {
		vi.useFakeTimers();
		vi.setSystemTime(FIXED_NOW);
		expect(buildExecutionsQuery({ ...base(), range: "7d" }).created).toBe(
			"gte:2026-05-03 12:00:00"
		);
		expect(buildExecutionsQuery({ ...base(), range: "30d" }).created).toBe(
			"gte:2026-04-10 12:00:00"
		);
	});

	it("omits 'created' when range is 'all'", () => {
		const q = buildExecutionsQuery({ ...base(), range: "all" });
		expect(q.created).toBeUndefined();
	});
});
