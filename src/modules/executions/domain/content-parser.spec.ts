import { describe, expect, it } from "vitest";
import {
	looksMarkdownish,
	normalizeJsonVisualization,
	selectPromotedMarkdownField,
} from "./content-parser";

describe("normalizeJsonVisualization", () => {
	it("parses object and array JSON values", () => {
		expect(normalizeJsonVisualization('{"name":"Alice"}')).toEqual({
			kind: "value",
			value: { name: "Alice" },
			wasStringEnvelope: false,
		});
		expect(normalizeJsonVisualization("[1,2,3]")).toEqual({
			kind: "value",
			value: [1, 2, 3],
			wasStringEnvelope: false,
		});
	});

	it("parses primitive JSON literals including valid null", () => {
		expect(normalizeJsonVisualization("123")).toEqual({
			kind: "value",
			value: 123,
			wasStringEnvelope: false,
		});
		expect(normalizeJsonVisualization("true")).toEqual({
			kind: "value",
			value: true,
			wasStringEnvelope: false,
		});
		expect(normalizeJsonVisualization("false")).toEqual({
			kind: "value",
			value: false,
			wasStringEnvelope: false,
		});
		expect(normalizeJsonVisualization("null")).toEqual({
			kind: "value",
			value: null,
			wasStringEnvelope: false,
		});
	});

	it("distinguishes parse failure from valid null", () => {
		expect(normalizeJsonVisualization("not json")).toEqual({
			kind: "unparseable",
			raw: "not json",
		});
	});

	it("decodes JSON string envelopes to plain strings", () => {
		const raw = JSON.stringify("# Report\n\n- Finding one\n- Finding two");

		expect(normalizeJsonVisualization(raw)).toEqual({
			kind: "value",
			value: "# Report\n\n- Finding one\n- Finding two",
			wasStringEnvelope: true,
		});
	});

	it("performs one bounded second parse for inner object-looking strings", () => {
		const raw = JSON.stringify(
			JSON.stringify({
				session_id: "abc",
				result: "# Report\n\n- Finding one",
			})
		);

		expect(normalizeJsonVisualization(raw)).toEqual({
			kind: "value",
			value: {
				session_id: "abc",
				result: "# Report\n\n- Finding one",
			},
			wasStringEnvelope: true,
		});
	});

	it("performs one bounded second parse for inner array-looking strings", () => {
		const raw = JSON.stringify(JSON.stringify([{ name: "Alice" }]));

		expect(normalizeJsonVisualization(raw)).toEqual({
			kind: "value",
			value: [{ name: "Alice" }],
			wasStringEnvelope: true,
		});
	});

	it("does not parse string envelopes whose decoded text is a primitive literal", () => {
		expect(normalizeJsonVisualization(JSON.stringify("42"))).toEqual({
			kind: "value",
			value: "42",
			wasStringEnvelope: true,
		});
		expect(normalizeJsonVisualization(JSON.stringify("true"))).toEqual({
			kind: "value",
			value: "true",
			wasStringEnvelope: true,
		});
	});

	it("falls back to the decoded string when the bounded second parse fails", () => {
		expect(normalizeJsonVisualization(JSON.stringify("{not valid}"))).toEqual({
			kind: "value",
			value: "{not valid}",
			wasStringEnvelope: true,
		});
	});

	it("does not recursively parse strings nested inside the second parsed value", () => {
		const innerJsonText = JSON.stringify({ deep: true });
		const raw = JSON.stringify(JSON.stringify([innerJsonText]));

		expect(normalizeJsonVisualization(raw)).toEqual({
			kind: "value",
			value: [innerJsonText],
			wasStringEnvelope: true,
		});
	});
});

describe("looksMarkdownish", () => {
	it("detects common Markdown block and inline markers", () => {
		expect(looksMarkdownish("# Heading")).toBe(true);
		expect(looksMarkdownish("Some intro\n- first item\n- second item")).toBe(
			true
		);
		expect(looksMarkdownish("Some intro\n+ first item\n+ second item")).toBe(
			true
		);
		expect(looksMarkdownish("Some intro\n1. first item\n2. second item")).toBe(
			true
		);
		expect(looksMarkdownish("```ts\nconst x = 1;\n```")).toBe(true);
		expect(looksMarkdownish("Before\n\n---\n\nAfter")).toBe(true);
		expect(looksMarkdownish("This is **important** text")).toBe(true);
		expect(
			looksMarkdownish("| Name | Score |\n| --- | --- |\n| Alice | 10 |")
		).toBe(true);
	});

	it("does not treat plain prose, opaque IDs, or JSON-looking text as Markdown", () => {
		expect(looksMarkdownish("This is plain prose with no markup.")).toBe(false);
		expect(looksMarkdownish("550e8400-e29b-41d4-a716-446655440000")).toBe(
			false
		);
		expect(looksMarkdownish('{"name":"Alice","score":10}')).toBe(false);
	});
});

describe("selectPromotedMarkdownField", () => {
	it("promotes an object's single Markdown-ish string field", () => {
		const value = {
			result: "# Report\n\n- Finding",
			usage: { total_tokens: 10 },
			run_id: "abc",
		};
		expect(selectPromotedMarkdownField(value)).toEqual({
			fieldName: "result",
			markdown: "# Report\n\n- Finding",
			metadataEntries: [
				["usage", { total_tokens: 10 }],
				["run_id", "abc"],
			],
		});
	});

	it("returns null when multiple string fields look Markdown-ish", () => {
		const value = {
			summary: "# Summary\n\n- A",
			analysis: "## Analysis\n\n- B",
		};
		expect(selectPromotedMarkdownField(value)).toBeNull();
	});

	it("returns null when no field looks Markdown-ish", () => {
		expect(selectPromotedMarkdownField({ name: "Alice", age: 30 })).toBeNull();
	});

	it("returns null for non-object values", () => {
		expect(selectPromotedMarkdownField(null)).toBeNull();
		expect(selectPromotedMarkdownField("# hi")).toBeNull();
		expect(selectPromotedMarkdownField([{ md: "# hi" }])).toBeNull();
		expect(selectPromotedMarkdownField(42)).toBeNull();
	});

	it("preserves original key order in metadataEntries", () => {
		const value = {
			alpha: 1,
			report: "# Report",
			beta: 2,
			gamma: 3,
		};
		const promoted = selectPromotedMarkdownField(value);
		expect(promoted?.metadataEntries.map(([k]) => k)).toEqual([
			"alpha",
			"beta",
			"gamma",
		]);
	});
});
