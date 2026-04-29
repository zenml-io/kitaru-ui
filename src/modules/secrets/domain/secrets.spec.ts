import { describe, expect, it } from "vitest";

import type { components } from "@/shared/api/openapi";

import { keysToValuesPayload, secretFromApiToDomain } from "./secrets";

type SecretResponse = components["schemas"]["SecretResponse"];

function apiSecret(overrides: Partial<SecretResponse> = {}): SecretResponse {
	return {
		id: "11111111-2222-3333-4444-555555555555",
		name: "my-secret",
		...overrides,
	};
}

describe("secretFromApiToDomain", () => {
	it("maps id, name, and derives shortId from the first 8 chars of id", () => {
		const result = secretFromApiToDomain(
			apiSecret({ id: "abcdefgh-more-here", name: "creds" })
		);
		expect(result.id).toBe("abcdefgh-more-here");
		expect(result.name).toBe("creds");
		expect(result.shortId).toBe("abcdefgh");
	});

	it("returns empty keys when body is absent", () => {
		const result = secretFromApiToDomain(apiSecret({ body: null }));
		expect(result.keys).toEqual([]);
		expect(result.isPrivate).toBeUndefined();
		expect(result.createdAt).toBeUndefined();
	});

	it("returns empty keys when body.values is absent", () => {
		const result = secretFromApiToDomain(
			apiSecret({
				body: {
					created: "2026-01-01T00:00:00Z",
					updated: "2026-01-01T00:00:00Z",
				},
			})
		);
		expect(result.keys).toEqual([]);
	});

	it("maps string values into SecretKey entries", () => {
		const result = secretFromApiToDomain(
			apiSecret({
				body: {
					created: "2026-01-01T00:00:00Z",
					updated: "2026-01-01T00:00:00Z",
					values: { api_key: "sk-123", region: "us-east-1" },
				},
			})
		);
		expect(result.keys).toEqual([
			{ key: "api_key", value: "sk-123" },
			{ key: "region", value: "us-east-1" },
		]);
	});

	it("stringifies null values to 'null'", () => {
		const result = secretFromApiToDomain(
			apiSecret({
				body: {
					created: "2026-01-01T00:00:00Z",
					updated: "2026-01-01T00:00:00Z",
					values: { api_key: "sk-123", missing: null },
				},
			})
		);
		expect(result.keys).toEqual([
			{ key: "api_key", value: "sk-123" },
			{ key: "missing", value: "null" },
		]);
	});

	it("parses createdAt when body.created is present", () => {
		const result = secretFromApiToDomain(
			apiSecret({
				body: {
					created: "2026-01-01T00:00:00Z",
					updated: "2026-01-01T00:00:00Z",
				},
			})
		);
		expect(result.createdAt).toBeInstanceOf(Date);
		expect(result.createdAt?.toISOString()).toBe("2026-01-01T00:00:00.000Z");
	});

	it("maps the resource user via userFromApiToDomain", () => {
		const result = secretFromApiToDomain(
			apiSecret({
				resources: {
					user: {
						id: "user-1",
						name: "dora",
						body: {
							created: "2026-01-01T00:00:00Z",
							updated: "2026-01-01T00:00:00Z",
							full_name: "Dora Explorer",
							is_service_account: false,
							is_admin: false,
						},
					},
				},
			})
		);
		expect(result.user?.id).toBe("user-1");
		expect(result.user?.resolvedName).toBe("Dora Explorer");
	});

	it("leaves user undefined when resources.user is missing", () => {
		const result = secretFromApiToDomain(apiSecret({ resources: null }));
		expect(result.user).toBeUndefined();
	});
});

describe("keysToValuesPayload", () => {
	it("converts SecretKey[] into a flat key/value record", () => {
		const payload = keysToValuesPayload([
			{ key: "api_key", value: "sk-123" },
			{ key: "region", value: "us-east-1" },
		]);
		expect(payload).toEqual({ api_key: "sk-123", region: "us-east-1" });
	});

	it("returns an empty object for an empty list", () => {
		expect(keysToValuesPayload([])).toEqual({});
	});
});
