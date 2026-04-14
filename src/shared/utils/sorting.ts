import type { SortingState } from "@tanstack/react-table";

export function sortingStateToParam(sorting: SortingState): string | undefined {
	if (!sorting || sorting.length === 0) return undefined;
	const first = sorting[0];
	if (!first) return undefined;
	return `${first.desc ? "desc" : "asc"}:${first.id}`;
}

export function paramToSortingState(param: string | undefined): SortingState {
	if (!param) return [];
	const [direction, key] = param.split(":");
	if (!direction || !key) return [];
	if (direction !== "asc" && direction !== "desc") return [];
	return [{ id: key, desc: direction === "desc" }];
}
