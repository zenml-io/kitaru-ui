import { describe, expect, it, vi } from "vitest";
import { FetchError } from "@/shared/api/domain/fetch-error";
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

	it("sets Content-Type and Source-Context headers on every request", async () => {
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(
				new Response(JSON.stringify({ id: "run-1" }), { status: 200 })
			);
		await invokeDeployment({ snapshotId: "snap-1", parameters: {} });
		const headers = fetchSpy.mock.calls[0][1]?.headers as Record<
			string,
			string
		>;
		expect(headers["Content-Type"]).toBe("application/json");
		expect(headers["Source-Context"]).toBe("kitaru-ui");
		fetchSpy.mockRestore();
	});

	it("throws FetchError with the server detail when the response is not ok", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ detail: "bad params" }), { status: 400 })
		);
		await expect(
			invokeDeployment({ snapshotId: "snap-1", parameters: {} })
		).rejects.toMatchObject({
			name: "FetchError",
			status: 400,
			message: "bad params",
		});
	});

	it("includes the raw body in the error message when the error response is not JSON", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("<html>502 Bad Gateway</html>", { status: 502 })
		);
		await expect(
			invokeDeployment({ snapshotId: "snap-1", parameters: {} })
		).rejects.toThrow(/502 Bad Gateway/);
	});

	it("stringifies the payload when detail is not a string", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ detail: { code: "E_FOO" } }), {
				status: 400,
			})
		);
		await expect(
			invokeDeployment({ snapshotId: "snap-1", parameters: {} })
		).rejects.toThrow(/E_FOO/);
	});

	it("wraps network errors as FetchError with status 0", async () => {
		vi.spyOn(globalThis, "fetch").mockRejectedValue(
			new TypeError("Failed to fetch")
		);
		const error = await invokeDeployment({
			snapshotId: "snap-1",
			parameters: {},
		}).catch((e) => e);
		expect(error).toBeInstanceOf(FetchError);
		expect(error.status).toBe(0);
		expect(error.statusText).toBe("REQUEST_FAILED");
	});

	it("throws when the success response is missing a run id", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({}), { status: 200 })
		);
		await expect(
			invokeDeployment({ snapshotId: "snap-1", parameters: {} })
		).rejects.toMatchObject({
			name: "FetchError",
			statusText: "INVALID_INVOKE_RESPONSE",
		});
	});
});
