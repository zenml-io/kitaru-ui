import { useState } from "react";
import type { SecretKey } from "../domain/secrets";

export type KeyRow = {
	id: string;
	key: string;
	value: string;
	visible: boolean;
};

let rowCounter = 0;
function nextRowId() {
	rowCounter += 1;
	return `row-${rowCounter}-${Date.now()}`;
}

export function createKeyRows(keys?: SecretKey[]): KeyRow[] {
	if (!keys || keys.length === 0) {
		return [{ id: nextRowId(), key: "", value: "", visible: false }];
	}
	return keys.map((k) => ({
		id: nextRowId(),
		key: k.key,
		value: k.value,
		visible: false,
	}));
}

export function useKeyRows(initial: KeyRow[]) {
	const [rows, setRows] = useState<KeyRow[]>(initial);

	function addRow() {
		setRows((prev) => [
			...prev,
			{ id: nextRowId(), key: "", value: "", visible: false },
		]);
	}

	function removeRow(id: string) {
		setRows((prev) => {
			const filtered = prev.filter((row) => row.id !== id);
			return filtered.length === 0
				? [{ id: nextRowId(), key: "", value: "", visible: false }]
				: filtered;
		});
	}

	function updateRow(id: string, field: "key" | "value", value: string) {
		setRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
		);
	}

	function toggleVisibility(id: string) {
		setRows((prev) =>
			prev.map((row) =>
				row.id === id ? { ...row, visible: !row.visible } : row
			)
		);
	}

	return { rows, addRow, removeRow, updateRow, toggleVisibility };
}
