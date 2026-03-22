import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ArtifactVisualization } from "../domain/visualization";
import { downloadVisualization } from "./download-visualization";

describe("downloadVisualization", () => {
	let anchor: {
		click: ReturnType<typeof vi.fn>;
		href: string;
		download: string;
	};

	beforeEach(() => {
		anchor = { click: vi.fn(), href: "", download: "" };

		vi.stubGlobal("document", {
			createElement: vi.fn().mockReturnValue(anchor),
			body: {
				appendChild: vi.fn(),
				removeChild: vi.fn(),
			},
		});

		vi.stubGlobal("URL", {
			createObjectURL: vi.fn().mockReturnValue("blob:mock-url"),
			revokeObjectURL: vi.fn(),
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it("downloads json with correct MIME type and .json extension", async () => {
		const viz: ArtifactVisualization = {
			type: "json",
			value: '{"foo":"bar"}',
		};
		const promise = downloadVisualization(viz, "my_artifact");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "application/json" })
		);
		expect(anchor.download).toBe("my_artifact.json");
		expect(anchor.click).toHaveBeenCalled();
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
	});

	it("downloads markdown with .md extension", async () => {
		const viz: ArtifactVisualization = { type: "markdown", value: "# Hello" };
		const promise = downloadVisualization(viz, "report");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "text/markdown" })
		);
		expect(anchor.download).toBe("report.md");
	});

	it("downloads html with .html extension", async () => {
		const viz: ArtifactVisualization = {
			type: "html",
			value: "<h1>Hi</h1>",
		};
		const promise = downloadVisualization(viz, "page");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "text/html" })
		);
		expect(anchor.download).toBe("page.html");
	});

	it("downloads csv with .csv extension", async () => {
		const viz: ArtifactVisualization = {
			type: "csv",
			value: "a,b\n1,2",
		};
		const promise = downloadVisualization(viz, "data");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "text/csv" })
		);
		expect(anchor.download).toBe("data.csv");
	});

	it("downloads image data URL by decoding base64", async () => {
		// Minimal 1x1 transparent PNG in base64
		const base64 =
			"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
		const viz: ArtifactVisualization = {
			type: "image",
			value: `data:image/png;base64,${base64}`,
		};
		const promise = downloadVisualization(viz, "photo");
		vi.runAllTimers();
		await promise;

		expect(URL.createObjectURL).toHaveBeenCalledWith(
			expect.objectContaining({ type: "image/png" })
		);
		expect(anchor.download).toBe("photo.png");
		expect(anchor.click).toHaveBeenCalled();
	});

	it("downloads image URL by fetching with credentials, extension from blob MIME type", async () => {
		const mockBlob = new Blob(["fake-image"], { type: "image/jpeg" });
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue({ ok: true, blob: () => Promise.resolve(mockBlob) })
		);

		const viz: ArtifactVisualization = {
			type: "image",
			value: "/api/v1/some-image-url",
		};
		const promise = downloadVisualization(viz, "photo");
		await promise;
		vi.runAllTimers();

		expect(fetch).toHaveBeenCalledWith("/api/v1/some-image-url", {
			credentials: "include",
		});
		expect(anchor.download).toBe("photo.jpg");
		expect(anchor.click).toHaveBeenCalled();
	});

	it("throws when image URL fetch returns non-ok response", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 404, blob: vi.fn() })
		);

		const viz: ArtifactVisualization = {
			type: "image",
			value: "/api/v1/missing-image",
		};

		await expect(downloadVisualization(viz, "photo")).rejects.toThrow(
			"Failed to fetch image: 404"
		);
	});
});
