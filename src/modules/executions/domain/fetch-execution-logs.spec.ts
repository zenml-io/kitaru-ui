import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type MockInstance,
} from "vitest";
import { apiClient } from "@/shared/api/domain/api-client";
import { fetchExecutionLogs } from "./fetch-execution-logs";

describe("fetchExecutionLogs", () => {
	let getSpy: MockInstance;

	beforeEach(() => {
		getSpy = vi.spyOn(apiClient, "GET");
	});

	afterEach(() => {
		getSpy.mockRestore();
	});

	it("translates domain source to API source and returns domain LogEntry[]", async () => {
		getSpy.mockResolvedValue({
			data: [
				{
					id: "log-1",
					message: "hello",
					level: 20,
					timestamp: "2026-04-17T09:41:00.003Z",
					chunk_index: 0,
					total_chunks: 1,
				},
			],
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		const result = await fetchExecutionLogs("run-123", "checkpoint");

		expect(getSpy).toHaveBeenCalledWith("/api/v1/runs/{run_id}/logs", {
			params: {
				path: { run_id: "run-123" },
				query: { source: "step" },
			},
		});
		expect(result).toHaveLength(1);
		expect(result[0].message).toBe("hello");
		expect(result[0].originalEntry).toBe(
			"[INFO] 2026-04-17T09:41:00.003Z hello"
		);
	});

	it("translates prepare_checkpoint domain source to prepare_step API source", async () => {
		getSpy.mockResolvedValue({
			data: [],
			error: undefined,
			response: new Response(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		await fetchExecutionLogs("run-123", "prepare_checkpoint");

		expect(getSpy).toHaveBeenCalledWith("/api/v1/runs/{run_id}/logs", {
			params: {
				path: { run_id: "run-123" },
				query: { source: "prepare_step" },
			},
		});
	});
});
