import { describe, expect, it } from "vitest";
import { expectLoginTokenResponse, isLoginTokenResponse } from "./types";

describe("isLoginTokenResponse", () => {
	it("returns true for token responses", () => {
		const result = isLoginTokenResponse({
			access_token: "token",
			token_type: "bearer",
		});

		expect(result).toBe(true);
	});

	it("returns false for redirect responses", () => {
		const result = isLoginTokenResponse({
			authorization_url: "https://example.com/oauth/authorize",
		});

		expect(result).toBe(false);
	});
});

describe("expectLoginTokenResponse", () => {
	it("returns token responses unchanged", () => {
		const response = {
			access_token: "token",
			token_type: "bearer",
		};

		expect(expectLoginTokenResponse(response)).toBe(response);
	});

	it("throws for redirect responses", () => {
		expect(() =>
			expectLoginTokenResponse({
				authorization_url: "https://example.com/oauth/authorize",
			})
		).toThrow("redirect response");
	});
});
