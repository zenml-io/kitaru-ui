import { describe, expect, it } from "vitest";

import { apiKeyFormSchema } from "./api-key-form-schema";

describe("apiKeyFormSchema", () => {
	it("accepts a name and empty description", () => {
		const result = apiKeyFormSchema.safeParse({
			name: "ci-token",
			description: "",
		});
		expect(result.success).toBe(true);
	});

	it("trims the name before validating", () => {
		const result = apiKeyFormSchema.safeParse({
			name: "  ci  ",
			description: "",
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.name).toBe("ci");
	});

	it("rejects an empty name", () => {
		const result = apiKeyFormSchema.safeParse({
			name: "  ",
			description: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejects names longer than 255 chars", () => {
		const result = apiKeyFormSchema.safeParse({
			name: "a".repeat(256),
			description: "",
		});
		expect(result.success).toBe(false);
	});
});
