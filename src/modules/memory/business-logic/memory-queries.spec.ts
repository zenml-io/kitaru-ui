import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchFlowMemories } = vi.hoisted(() => ({
	fetchFlowMemories: vi.fn(),
}));

vi.mock("../domain/fetch-flow-memories", () => ({
	fetchFlowMemories,
}));

import { memoryQueries, memoryQueryKeys } from "./memory-queries";

describe("memoryQueryKeys.flow", () => {
	it("keys flow-scoped memory by raw flow id", () => {
		expect(memoryQueryKeys.flow("flow-123")).toEqual([
			"memory",
			"flow",
			"flow-123",
		]);
	});
});

describe("memoryQueries.flow", () => {
	beforeEach(() => {
		fetchFlowMemories.mockReset();
		fetchFlowMemories.mockResolvedValue([]);
	});

	it("fetches flow-scoped memory by raw flow id", async () => {
		await memoryQueries.flow("flow-123").queryFn?.({} as never);

		expect(fetchFlowMemories).toHaveBeenCalledWith("flow-123");
	});
});
