import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { SecretKey } from "../domain/secrets";
import { useSecretKeySearch } from "./use-secret-key-search";

const keys: SecretKey[] = [
	{ key: "API_KEY", value: "1" },
	{ key: "DB_URL", value: "2" },
	{ key: "api_secret", value: "3" },
];

describe("useSecretKeySearch", () => {
	it("returns all keys when search is empty", () => {
		const { result } = renderHook(() => useSecretKeySearch(keys));
		expect(result.current.filteredKeys).toEqual(keys);
	});

	it("filters case-insensitively by substring match on key name", () => {
		const { result } = renderHook(() => useSecretKeySearch(keys));
		act(() => result.current.setSearch("api"));
		expect(result.current.filteredKeys.map((k) => k.key)).toEqual([
			"API_KEY",
			"api_secret",
		]);
	});

	it("ignores whitespace-only search", () => {
		const { result } = renderHook(() => useSecretKeySearch(keys));
		act(() => result.current.setSearch("   "));
		expect(result.current.filteredKeys).toEqual(keys);
	});

	it("returns an empty array when nothing matches", () => {
		const { result } = renderHook(() => useSecretKeySearch(keys));
		act(() => result.current.setSearch("nope"));
		expect(result.current.filteredKeys).toEqual([]);
	});
});
