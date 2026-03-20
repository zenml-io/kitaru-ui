import { describe, expect, it } from "vitest";
import { sanitizeUuidFromPath } from "./sanize-uuid";

describe("removeUUIDSegmentsFromPath", () => {
	it("replaces a UUID v4 path segment with <id>", () => {
		const path = "/runs/123e4567-e89b-42d3-a456-426614174000/steps";

		expect(sanitizeUuidFromPath(path)).toBe("/runs/<id>/steps");
	});

	it("replaces multiple UUID v4 segments in the same path", () => {
		const path =
			"/runs/123e4567-e89b-42d3-a456-426614174000/artifacts/987e6543-e21b-4d3a-b654-123456789abc";

		expect(sanitizeUuidFromPath(path)).toBe("/runs/<id>/artifacts/<id>");
	});

	it("matches UUID v4 case-insensitively", () => {
		const path = "/RUNS/123E4567-E89B-42D3-A456-426614174000/STEPS";

		expect(sanitizeUuidFromPath(path)).toBe("/RUNS/<id>/STEPS");
	});

	it("does not replace non-v4 UUID values", () => {
		const path = "/runs/123e4567-e89b-12d3-a456-426614174000/steps";

		expect(sanitizeUuidFromPath(path)).toBe(path);
	});

	it("returns the original path when there are no UUIDs", () => {
		const path = "/runs/latest/steps";

		expect(sanitizeUuidFromPath(path)).toBe(path);
	});
});
