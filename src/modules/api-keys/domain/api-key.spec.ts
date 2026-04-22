import { describe, expect, it } from "vitest";

import { apiKeyFromApiToDomain } from "./api-key";

describe("apiKeyFromApiToDomain", () => {
	it("maps the common fields", () => {
		const result = apiKeyFromApiToDomain({
			id: "aaaa",
			name: "my-key",
			body: {
				created: "2026-01-01T00:00:00Z",
				updated: "2026-01-02T00:00:00Z",
				active: true,
				service_account: {
					id: "sa-1",
					name: "pat-uuid",
				},
			},
			metadata: {
				description: "for CI",
				retain_period_minutes: 0,
				last_login: "2026-02-01T00:00:00Z",
				last_rotated: null,
			},
		});

		expect(result).toMatchObject({
			id: "aaaa",
			name: "my-key",
			description: "for CI",
			active: true,
			plaintextKey: undefined,
		});
		expect(result.lastLogin?.toISOString()).toBe("2026-02-01T00:00:00.000Z");
		expect(result.createdAt?.toISOString()).toBe("2026-01-01T00:00:00.000Z");
	});

	it("defaults missing optional fields to undefined", () => {
		const result = apiKeyFromApiToDomain({
			id: "bbb",
			name: "bare",
		});
		expect(result).toMatchObject({
			id: "bbb",
			name: "bare",
			description: undefined,
			lastLogin: undefined,
			active: undefined,
			plaintextKey: undefined,
		});
	});

	it("exposes the plaintext key when the body contains one (post-create/rotate)", () => {
		const result = apiKeyFromApiToDomain({
			id: "ccc",
			name: "fresh",
			body: {
				created: "2026-01-01T00:00:00Z",
				updated: "2026-01-01T00:00:00Z",
				key: "ZENML_SK_PLAINTEXT",
				active: true,
				service_account: { id: "sa-1", name: "pat-uuid" },
			},
		});

		expect(result.plaintextKey).toBe("ZENML_SK_PLAINTEXT");
		expect(result.active).toBe(true);
	});

	it("treats empty-string description as undefined", () => {
		const result = apiKeyFromApiToDomain({
			id: "ddd",
			name: "k",
			metadata: { description: "", retain_period_minutes: 0 },
		});
		expect(result.description).toBeUndefined();
	});
});
