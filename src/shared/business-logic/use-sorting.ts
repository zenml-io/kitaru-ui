import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { paramToSortingState, sortingStateToParam } from "../utils/sorting";

type UpdateSearchFn = (sort: string) => void;

export function useSorting(
	sortParam: string | undefined,
	defaultSort: string,
	updateSearch: UpdateSearchFn
) {
	const sortingState = paramToSortingState(sortParam);

	const onSortingChange: OnChangeFn<SortingState> = (updater) => {
		const nextState =
			typeof updater === "function" ? updater(sortingState) : updater;
		const nextSort = sortingStateToParam(nextState) ?? defaultSort;
		updateSearch(nextSort);
	};

	return { sortingState, onSortingChange };
}
