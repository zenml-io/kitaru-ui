import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createKeyRows, useKeyRows } from "./use-key-rows";

describe("createKeyRows", () => {
	it("returns a single empty row when no keys are given", () => {
		const rows = createKeyRows();
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
	it("adds, updates, removes and toggles rows", () => {
		const { result } = renderHook(() => useKeyRows(createKeyRows()));

		act(() => result.current.addRow());
		expect(result.current.rows).toHaveLength(2);

		const firstId = result.current.rows[0].id;
		act(() => result.current.updateRow(firstId, "key", "API_KEY"));
		act(() => result.current.updateRow(firstId, "value", "sk-123"));
		expect(result.current.rows[0]).toMatchObject({
			key: "API_KEY",
			value: "sk-123",
		});

		act(() => result.current.toggleVisibility(firstId));
		expect(result.current.rows[0].visible).toBe(true);

		act(() => result.current.removeRow(firstId));
		expect(result.current.rows).toHaveLength(1);
		expect(result.current.rows[0].id).not.toBe(firstId);
	});
});
