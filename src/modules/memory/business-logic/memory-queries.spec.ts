import { describe, expect, it, vi } from "vitest";
import { memoryQueries, memoryQueryKeys } from "./memory-queries";

vi.mock("../domain/fetch-namespace-memories", () => ({
	fetchNamespaceMemories: vi.fn(),
}));

vi.mock("../domain/fetch-flow-memories", () => ({
	fetchFlowMemories: vi.fn(),
}));

vi.mock("../domain/fetch-execution-memories", () => ({
	fetchExecutionMemories: vi.fn(),
}));

vi.mock("../domain/fetch-single-execution-memories", () => ({
	fetchSingleExecutionMemories: vi.fn(),
}));

vi.mock("../domain/fetch-memory-history", () => ({
	fetchMemoryHistory: vi.fn(),
}));

describe("memoryQueryKeys.history", () => {
	it("distinguishes scopes that share a name but not a scope type", () => {
		expect(
			memoryQueryKeys.history(
				{ scope: "coding_agent", scopeType: "flow" },
				"counter"
			)
		).not.toEqual(
			memoryQueryKeys.history(
				{ scope: "coding_agent", scopeType: "namespace" },
				"counter"
			)
		);
	});
});

describe("memoryQueries.history", () => {
	it("includes the scope type in the query key", () => {
		const query = memoryQueries.history(
			{ scope: "coding_agent", scopeType: "flow" },
			"counter"
		);

		expect(query.queryKey).toEqual([
			"memory",
			"history",
			"flow",
			"coding_agent",
			"counter",
		]);
	});
});
