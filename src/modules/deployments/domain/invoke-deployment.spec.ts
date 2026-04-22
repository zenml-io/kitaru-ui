import { describe, expect, it, vi } from "vitest";
import { invokeDeployment } from "./invoke-deployment";

describe("invokeDeployment", () => {
	it("POSTs { run_configuration: { parameters } } to /pipeline_snapshots/{id}/runs and returns run id on success", async () => {
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(
				new Response(JSON.stringify({ id: "run-42" }), { status: 200 })
			);
		const result = await invokeDeployment({
			snapshotId: "snap-1",
			parameters: { topic: "hi" },
		});
		expect(result).toEqual({ runId: "run-42" });
		const [url, init] = fetchSpy.mock.calls[0];
		expect(url).toMatch(/\/api\/v1\/pipeline_snapshots\/snap-1\/runs$/);
		expect(init?.method).toBe("POST");
		expect(init?.credentials).toBe("include");
		expect(JSON.parse(String(init?.body))).toEqual({
			run_configuration: { parameters: { topic: "hi" } },
		});
		fetchSpy.mockRestore();
	});

	it("throws with the server message when the response is not ok", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ detail: "bad params" }), { status: 400 })
		);
		await expect(
			invokeDeployment({ snapshotId: "snap-1", parameters: {} })
		).rejects.toThrow(/bad params/);
	});
});
