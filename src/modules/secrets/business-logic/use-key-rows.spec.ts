import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createKeyRows, useKeyRows } from "./use-key-rows";

describe("createKeyRows", () => {
	it("returns a single empty row when no keys are given", () => {
		const rows = createKeyRows();
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({ key: "", value: "", visible: false });
	});

	it("returns a single empty row when an empty array is given", () => {
		const rows = createKeyRows([]);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({ key: "", value: "", visible: false });
	});

	it("maps existing keys to rows with stable ids and hidden values", () => {
		const rows = createKeyRows([
			{ key: "a", value: "1" },
			{ key: "b", value: "2" },
		]);
		expect(rows).toHaveLength(2);
		expect(rows[0]).toMatchObject({ key: "a", value: "1", visible: false });
		expect(rows[1]).toMatchObject({ key: "b", value: "2", visible: false });
		expect(rows[0].id).not.toEqual(rows[1].id);
	});
});

describe("useKeyRows", () => {
	it("addRow appends a new empty row", () => {
		const { result } = renderHook(() => useKeyRows(createKeyRows()));
		act(() => result.current.addRow());
		expect(result.current.rows).toHaveLength(2);
		expect(result.current.rows[1]).toMatchObject({
			key: "",
			value: "",
			visible: false,
		});
	});

	it("updateRow edits the matching row's key or value", () => {
		const { result } = renderHook(() => useKeyRows(createKeyRows()));
		const id = result.current.rows[0].id;

		act(() => result.current.updateRow(id, "key", "API_KEY"));
		act(() => result.current.updateRow(id, "value", "sk-123"));

		expect(result.current.rows[0]).toMatchObject({
			key: "API_KEY",
			value: "sk-123",
		});
	});

	it("updateRow is a no-op for an unknown id", () => {
		const { result } = renderHook(() => useKeyRows(createKeyRows()));
		const before = result.current.rows;

		act(() => result.current.updateRow("does-not-exist", "key", "X"));

		expect(result.current.rows).toEqual(before);
	});

	it("removeRow deletes the matching row when others remain", () => {
		const { result } = renderHook(() =>
			useKeyRows(
				createKeyRows([
					{ key: "a", value: "1" },
					{ key: "b", value: "2" },
				])
			)
		);
		const firstId = result.current.rows[0].id;

		act(() => result.current.removeRow(firstId));

		expect(result.current.rows).toHaveLength(1);
		expect(result.current.rows[0]).toMatchObject({ key: "b", value: "2" });
	});

	it("removeRow replaces the last remaining row with a fresh empty one", () => {
		const { result } = renderHook(() => useKeyRows(createKeyRows()));
		const firstId = result.current.rows[0].id;

		act(() => result.current.removeRow(firstId));

		expect(result.current.rows).toHaveLength(1);
		expect(result.current.rows[0].id).not.toBe(firstId);
		expect(result.current.rows[0]).toMatchObject({ key: "", value: "" });
	});

	it("removeRow is a no-op for an unknown id", () => {
		const { result } = renderHook(() => useKeyRows(createKeyRows()));
		const before = result.current.rows;

		act(() => result.current.removeRow("does-not-exist"));

		expect(result.current.rows).toEqual(before);
	});

	it("toggleVisibility flips the row's visible flag both ways", () => {
		const { result } = renderHook(() => useKeyRows(createKeyRows()));
		const id = result.current.rows[0].id;

		act(() => result.current.toggleVisibility(id));
		expect(result.current.rows[0].visible).toBe(true);

		act(() => result.current.toggleVisibility(id));
		expect(result.current.rows[0].visible).toBe(false);
	});
});
