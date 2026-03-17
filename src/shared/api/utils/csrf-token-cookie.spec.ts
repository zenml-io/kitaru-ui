import { afterEach, describe, expect, it, vi } from "vitest";

const cookieMocks = vi.hoisted(() => ({
	set: vi.fn(),
	get: vi.fn(),
	remove: vi.fn(),
}));

vi.mock("js-cookie", () => ({
	default: cookieMocks,
}));

import {
	clearCsrfToken,
	csrfTokenCookieName,
	getCsrfToken,
	setCsrfToken,
} from "./csrf-token-cookie";

function mockBrowser(protocol: string) {
	vi.stubGlobal("document", {});
	vi.stubGlobal("window", {
		location: {
			protocol,
		},
	});
}

describe("csrf token cookie helpers", () => {
	afterEach(() => {
		cookieMocks.set.mockReset();
		cookieMocks.get.mockReset();
		cookieMocks.remove.mockReset();
		vi.unstubAllGlobals();
	});

	it("sets csrf token with strict host-only cookie options on https", () => {
		mockBrowser("https:");

		setCsrfToken("csrf-value");

		expect(cookieMocks.set).toHaveBeenCalledWith(
			csrfTokenCookieName,
			"csrf-value",
			{
				path: "/",
				sameSite: "strict",
				secure: true,
			}
		);
	});

	it("sets csrf token without secure flag on http", () => {
		mockBrowser("http:");

		setCsrfToken("csrf-value");

		expect(cookieMocks.set).toHaveBeenCalledWith(
			csrfTokenCookieName,
			"csrf-value",
			{
				path: "/",
				sameSite: "strict",
			}
		);
	});

	it("reads csrf token from the configured cookie", () => {
		mockBrowser("https:");
		cookieMocks.get.mockReturnValue("token-from-cookie");

		const token = getCsrfToken();

		expect(token).toBe("token-from-cookie");
		expect(cookieMocks.get).toHaveBeenCalledWith(csrfTokenCookieName);
	});

	it("clears csrf token with matching cookie attributes", () => {
		mockBrowser("https:");

		clearCsrfToken();

		expect(cookieMocks.remove).toHaveBeenCalledWith(csrfTokenCookieName, {
			path: "/",
			sameSite: "strict",
			secure: true,
		});
	});
});
