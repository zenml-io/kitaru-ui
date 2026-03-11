import { describe, expect, it } from "vitest";
import { serverActivationSchema } from "./server-activation-schema";

describe("serverActivationFormSchema", () => {
	it("passes validation when admin password and confirmation match", () => {
		const result = serverActivationSchema.safeParse({
			server_name: "My Kitaru Server",
			admin_username: "admin",
			admin_password: "secret-password",
			admin_password_confirmation: "secret-password",
		});

		expect(result.success).toBe(true);
	});

	it("returns a confirmation field error when passwords do not match", () => {
		const result = serverActivationSchema.safeParse({
			server_name: "My Kitaru Server",
			admin_username: "admin",
			admin_password: "secret-password",
			admin_password_confirmation: "different-password",
		});

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error("Expected schema validation to fail");
		}

		const passwordConfirmationIssue = result.error.issues.find((issue) =>
			issue.path.includes("admin_password_confirmation")
		);

		expect(passwordConfirmationIssue?.path).toEqual([
			"admin_password_confirmation",
		]);
		expect(passwordConfirmationIssue?.message).toBe(
			"Passwords do not match. Please enter the same password in both fields."
		);
	});

	it("requires admin password confirmation", () => {
		const result = serverActivationSchema.safeParse({
			server_name: "My Kitaru Server",
			admin_username: "admin",
			admin_password: "secret-password",
			admin_password_confirmation: "",
		});

		expect(result.success).toBe(false);
		if (result.success) {
			throw new Error("Expected schema validation to fail");
		}

		const passwordConfirmationIssue = result.error.issues.find((issue) =>
			issue.path.includes("admin_password_confirmation")
		);

		expect(passwordConfirmationIssue?.message).toBe(
			"Please confirm your admin password."
		);
	});
});
