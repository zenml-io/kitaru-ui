import { isFetchError } from "@/shared/api/domain/fetch-error";
import { describe, expect, it } from "vitest";
import { expectData, expectOptionalData } from "./unwrap-api-result";

describe("expectData", () => {
	it("returns data when present", () => {
		const response = new Response(null, { status: 200, statusText: "OK" });
		const result = expectData({
			data: {
				id: "1",
			},
			response,
		});

		expect(result).toEqual({ id: "1" });
	});

	it("throws a fetch error when the error channel is present", () => {
		const response = new Response(null, {
			status: 400,
			statusText: "Bad Request",
		});
		const error = new Error("request failed");
		let thrownError: unknown;

		try {
			expectData({
				error,
				response,
			});
		} catch (caughtError) {
			thrownError = caughtError;
		}

		expect(isFetchError(thrownError)).toBe(true);
		if (isFetchError(thrownError)) {
			expect(thrownError.status).toBe(400);
			expect(thrownError.statusText).toBe("Error while fetching data");
			expect(thrownError.message).toContain("Error while fetching data:");
		}
	});

	it("throws a fetch error if data and error are both missing", () => {
		const response = new Response(null, { status: 200, statusText: "OK" });
		let thrownError: unknown;

		try {
			expectData({
				response,
			});
		} catch (error) {
			thrownError = error;
		}

		expect(isFetchError(thrownError)).toBe(true);
		if (isFetchError(thrownError)) {
			expect(thrownError.message).toContain("returned neither data nor error");
			expect(thrownError.status).toBe(200);
			expect(thrownError.statusText).toBe("INVARIANT_VIOLATION");
		}
	});

	it("preserves null payloads", () => {
		const response = new Response(null, { status: 200, statusText: "OK" });
		const result = expectData<null, Error>({
			data: null,
			response,
		});

		expect(result).toBeNull();
	});
});

describe("expectOptionalData", () => {
	it("returns undefined when data is missing and no error exists", () => {
		const response = new Response(null, { status: 200, statusText: "OK" });
		const result = expectOptionalData<string, Error>({ response });
		expect(result).toBeUndefined();
	});

	it("throws a fetch error when the error channel is present", () => {
		const response = new Response(null, {
			status: 401,
			statusText: "Unauthorized",
		});
		const error = new Error("request failed");
		let thrownError: unknown;

		try {
			expectOptionalData({
				error,
				response,
			});
		} catch (caughtError) {
			thrownError = caughtError;
		}

		expect(isFetchError(thrownError)).toBe(true);
		if (isFetchError(thrownError)) {
			expect(thrownError.status).toBe(401);
			expect(thrownError.statusText).toBe("Error while fetching data");
		}
	});
});
