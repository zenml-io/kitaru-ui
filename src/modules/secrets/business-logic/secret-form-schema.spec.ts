import { describe, expect, it } from "vitest";

import { secretFormSchema } from "./secret-form-schema";

describe("secretFormSchema", () => {
	it("accepts a valid name and at least one non-empty key", () => {
		const result = secretFormSchema.safeParse({
			name: "my-secret",
			keys: [{ key: "API_KEY", value: "abc" }],
		});
		expect(result.success).toBe(true);
	});

	it("rejects an empty name", () => {
		const result = secretFormSchema.safeParse({
			name: "   ",
			keys: [{ key: "API_KEY", value: "abc" }],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].path).toEqual(["name"]);
			expect(result.error.issues[0].message).toBe(
				"Please enter a secret name."
			);
		}
	});

	it("rejects when no key rows have a non-empty key", () => {
		const result = secretFormSchema.safeParse({
			name: "my-secret",
			keys: [
				{ key: "", value: "x" },
				{ key: "   ", value: "y" },
			],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const issue = result.error.issues.find(
				(i) => i.message === "Add at least one key."
			);
			expect(issue).toBeDefined();
		}
	});

	it("rejects duplicate keys and reports the offending index", () => {
		const result = secretFormSchema.safeParse({
			name: "my-secret",
			keys: [
				{ key: "API_KEY", value: "1" },
				{ key: "API_KEY", value: "2" },
			],
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			const issue = result.error.issues.find((i) =>
				i.message.startsWith("Duplicate key")
			);
			expect(issue).toBeDefined();
			expect(issue?.path).toEqual(["keys", 1, "key"]);
		}
	});

	it("ignores empty rows when checking duplicates", () => {
		const result = secretFormSchema.safeParse({
			name: "my-secret",
			keys: [
				{ key: "API_KEY", value: "1" },
				{ key: "", value: "" },
			],
		});
		expect(result.success).toBe(true);
	});

	it("trims the name before validating", () => {
		const result = secretFormSchema.safeParse({
			name: "  spaced  ",
			keys: [{ key: "API_KEY", value: "1" }],
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("spaced");
		}
	});
});
