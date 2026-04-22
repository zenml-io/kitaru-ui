import { describe, expect, it } from "vitest";

import { rotateApiKeyFormSchema } from "./rotate-api-key-form-schema";

describe("rotateApiKeyFormSchema", () => {
	it("accepts rotation with retention disabled and no minutes", () => {
		const result = rotateApiKeyFormSchema.safeParse({
			enableRetention: false,
			retainPeriodMinutes: "",
		});
		expect(result.success).toBe(true);
	});

	it("rejects enabled retention with empty minutes", () => {
		const result = rotateApiKeyFormSchema.safeParse({
			enableRetention: true,
			retainPeriodMinutes: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejects enabled retention with non-integer minutes", () => {
		const result = rotateApiKeyFormSchema.safeParse({
			enableRetention: true,
			retainPeriodMinutes: "1.5",
		});
		expect(result.success).toBe(false);
	});

	it("rejects enabled retention with zero or negative minutes", () => {
		const result = rotateApiKeyFormSchema.safeParse({
			enableRetention: true,
			retainPeriodMinutes: "0",
		});
		expect(result.success).toBe(false);
	});

	it("accepts enabled retention with a positive integer", () => {
		const result = rotateApiKeyFormSchema.safeParse({
			enableRetention: true,
			retainPeriodMinutes: "15",
		});
		expect(result.success).toBe(true);
	});
});
