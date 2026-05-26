import { useSuspenseQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import { executionsQueries } from "../business-logic/executions-queries";
import { toGlobalExecutionsRows } from "../business-logic/to-global-executions-rows";
import type { GlobalExecutionsSearch } from "../domain/global-executions-query-params";
import { GlobalExecutionsPagination } from "../ui/GlobalExecutionsPagination";
import { GlobalExecutionsTable } from "../ui/GlobalExecutionsTable";

type GlobalExecutionsPaginatedTableContainerProps = {
	search: GlobalExecutionsSearch;
	sorting: SortingState;
	onSortingChange: (state: SortingState) => void;
	hasActiveFilters: boolean;
	onClearFilters: () => void;
	onPageChange: (page: number) => void;
};

export function GlobalExecutionsPaginatedTableContainer({
	search,
	sorting,
	onSortingChange,
	hasActiveFilters,
	onClearFilters,
	onPageChange,
}: GlobalExecutionsPaginatedTableContainerProps) {
	const { data: page } = useSuspenseQuery(executionsQueries.global(search));
	const rows = toGlobalExecutionsRows(page.items);

	return (
		<>
			<GlobalExecutionsTable
				rows={rows}
				sorting={sorting}
				onSortingChange={onSortingChange}
				hasActiveFilters={hasActiveFilters}
				onClearFilters={onClearFilters}
			/>
			<GlobalExecutionsPagination
				page={page.page}
				totalPages={page.totalPages}
				total={page.total}
				onPageChange={onPageChange}
			/>
		</>
	);
}
