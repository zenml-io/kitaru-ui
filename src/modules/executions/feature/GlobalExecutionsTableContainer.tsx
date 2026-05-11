import { useSuspenseQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import { executionsQueries } from "../business-logic/executions-queries";
import { toGlobalExecutionsRows } from "../business-logic/to-global-executions-rows";
import type { GlobalExecutionsQueryParams } from "../domain/global-executions-query-params";
import { GlobalExecutionsTable } from "../ui/GlobalExecutionsTable";

type GlobalExecutionsTableContainerProps = {
	params: GlobalExecutionsQueryParams;
	sorting: SortingState;
	onSortingChange: (state: SortingState) => void;
	hasActiveFilters: boolean;
	onClearFilters: () => void;
};

export function GlobalExecutionsTableContainer({
	params,
	sorting,
	onSortingChange,
	hasActiveFilters,
	onClearFilters,
}: GlobalExecutionsTableContainerProps) {
	const { data: page } = useSuspenseQuery(executionsQueries.global(params));
	const rows = toGlobalExecutionsRows(page.items);

	return (
		<GlobalExecutionsTable
			rows={rows}
			sorting={sorting}
			onSortingChange={onSortingChange}
			hasActiveFilters={hasActiveFilters}
			onClearFilters={onClearFilters}
		/>
	);
}
