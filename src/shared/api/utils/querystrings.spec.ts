import { describe, expect, it } from "vitest";

import { buildQueryString } from "./querystrings";

describe("buildQueryString", () => {
	it("skips null and undefined values", () => {
		const query = buildQueryString({
			keep: "value",
			skipNull: null,
			skipUndefined: undefined,
		});

		const params = new URLSearchParams(query);
		expect(params.get("keep")).toBe("value");
		expect(params.has("skipNull")).toBe(false);
		expect(params.has("skipUndefined")).toBe(false);
	});

	it("handles arrays by appending multiple values for the same key", () => {
		const query = buildQueryString({
			tags: ["a", "b", null, undefined, "c"],
		});

		const params = new URLSearchParams(query);
		expect(params.getAll("tags")).toEqual(["a", "b", "c"]);
	});

	it("stringifies top-level objects", () => {
		const query = buildQueryString({
			filters: { active: true, page: 2 },
		});

		const params = new URLSearchParams(query);
		expect(params.get("filters")).toBe('{"active":true,"page":2}');
	});

	it("stringifies objects inside arrays", () => {
		const query = buildQueryString({
			items: [{ id: 1 }, "raw", { id: 2 }],
		});

		const params = new URLSearchParams(query);
		expect(params.getAll("items")).toEqual(['{"id":1}', "raw", '{"id":2}']);
	});

	it("converts primitive non-string values to strings", () => {
		const query = buildQueryString({
			page: 3,
			enabled: false,
			big: 9007199254740991n,
		});

		const params = new URLSearchParams(query);
		expect(params.get("page")).toBe("3");
		expect(params.get("enabled")).toBe("false");
		expect(params.get("big")).toBe("9007199254740991");
	});

	it("encodes and decodes special characters correctly", () => {
		const query = buildQueryString({
			text: "a b&c=d?",
			emoji: "hello🙂",
		});

		const params = new URLSearchParams(query);
		expect(params.get("text")).toBe("a b&c=d?");
		expect(params.get("emoji")).toBe("hello🙂");
	});

	it("preserves key and array item order", () => {
		const query = buildQueryString({
			first: "1",
			second: ["a", "b"],
			third: "3",
		});

		expect(query).toBe("first=1&second=a&second=b&third=3");
	});

	it("does not append a key for empty arrays", () => {
		const query = buildQueryString({
			empty: [],
			keep: "value",
		});

		const params = new URLSearchParams(query);
		expect(params.has("empty")).toBe(false);
		expect(params.get("keep")).toBe("value");
	});

	it("stringifies nested objects only once", () => {
		const query = buildQueryString({
			payload: { nested: { id: 1, flags: [true, false] } },
		});

		const params = new URLSearchParams(query);
		expect(params.get("payload")).toBe('{"nested":{"id":1,"flags":[true,false]}}');
	});

	it("serializes Date values via JSON rules", () => {
		const date = new Date("2024-01-01T00:00:00.000Z");
		const query = buildQueryString({
			when: date,
			list: [date],
		});

		const params = new URLSearchParams(query);
		expect(params.get("when")).toBe('"2024-01-01T00:00:00.000Z"');
		expect(params.getAll("list")).toEqual(['"2024-01-01T00:00:00.000Z"']);
	});

	it("handles NaN and Infinity according to conversion strategy", () => {
		const query = buildQueryString({
			nanPrimitive: NaN,
			infinityPrimitive: Infinity,
			objectValue: { nan: NaN, infinity: Infinity },
		});

		const params = new URLSearchParams(query);
		expect(params.get("nanPrimitive")).toBe("NaN");
		expect(params.get("infinityPrimitive")).toBe("Infinity");
		expect(params.get("objectValue")).toBe('{"nan":null,"infinity":null}');
	});
});
