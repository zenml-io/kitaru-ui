import { Suspense } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import { GlobalExecutionsHeader } from "../ui/GlobalExecutionsHeader";
import { GlobalExecutionsTableSkeleton } from "../ui/GlobalExecutionsTableSkeleton";
import { GlobalExecutionsFilterBarSkeleton } from "../ui/GlobalExecutionsFilterBarSkeleton";
import { GlobalExecutionsPaginatedTableContainer } from "./GlobalExecutionsPaginatedTableContainer";
import { GlobalExecutionsFilterBarContainer } from "./GlobalExecutionsFilterBarContainer";
import { GLOBAL_EXECUTIONS_SEARCH_DEFAULTS } from "../domain/global-executions-query-params";
import {
	type FilterChange,
	filterChangeToSearchPatch,
} from "../business-logic/filter-change-to-search-patch";
import {
	paramToSortingState,
	sortingStateToParam,
} from "@/shared/utils/sorting";

export function GlobalExecutionsContainer() {
	const search = useSearch({ from: "/_private/_navbar/executions/" });
	const navigate = useNavigate();

	const sortingState = paramToSortingState(search.sort);

	const onSortingChange = (state: SortingState) => {
		const nextSort = sortingStateToParam(state) ?? "desc:created";
		void navigate({
			to: "/executions",
			search: (prev) => ({ ...prev, sort: nextSort, page: 1 }),
			replace: true,
		});
	};

	const onPageChange = (nextPage: number) => {
		void navigate({
			to: "/executions",
			search: (prev) => ({ ...prev, page: nextPage }),
			replace: true,
		});
	};

	const onFilterChange = (next: FilterChange) => {
		void navigate({
			to: "/executions",
			search: (prev) => ({
				...prev,
				...filterChangeToSearchPatch(next),
				page: 1,
			}),
			replace: true,
		});
	};

	const hasActiveFilters =
		search.status !== GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.status ||
		search.range !== GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.range ||
		search.q !== GLOBAL_EXECUTIONS_SEARCH_DEFAULTS.q ||
		search.flow !== undefined ||
		search.version !== undefined ||
		search.stack !== undefined;

	// Clearing filters resets every filter to its default by dropping the
	// params entirely; the schema's `.catch()` fallbacks repopulate them.
	// `sort` is intentionally preserved — it isn't a filter.
	const onClearFilters = () => {
		void navigate({
			to: "/executions",
			search: (prev) => ({ sort: prev.sort }),
			replace: true,
		});
	};

	return (
		<div className="flex h-full flex-col">
			<GlobalExecutionsHeader />
			<Suspense fallback={<GlobalExecutionsFilterBarSkeleton />}>
				<GlobalExecutionsFilterBarContainer
					status={search.status}
					flowId={search.flow}
					snapshotId={search.version}
					stackId={search.stack}
					range={search.range}
					search={search.q}
					onChange={onFilterChange}
				/>
			</Suspense>
			<div className="flex-1 overflow-y-auto">
				<div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
					<Suspense fallback={<GlobalExecutionsTableSkeleton />}>
						<GlobalExecutionsPaginatedTableContainer
							search={search}
							sorting={sortingState}
							onSortingChange={onSortingChange}
							hasActiveFilters={hasActiveFilters}
							onClearFilters={onClearFilters}
							onPageChange={onPageChange}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
}
