import { Suspense } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import { GlobalExecutionsHeader } from "../ui/GlobalExecutionsHeader";
import { GlobalExecutionsTableSkeleton } from "../ui/GlobalExecutionsTableSkeleton";
import { GlobalExecutionsFilterBarSkeleton } from "../ui/GlobalExecutionsFilterBarSkeleton";
import { GlobalExecutionsPaginatedTableContainer } from "./GlobalExecutionsPaginatedTableContainer";
import { GlobalExecutionsFilterBarContainer } from "./GlobalExecutionsFilterBarContainer";
import {
	DEFAULT_GLOBAL_EXECUTIONS_PAGE_SIZE,
	type GlobalExecutionsQueryParams,
} from "../domain/global-executions-query-params";
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

	const params: GlobalExecutionsQueryParams = {
		status: search.status,
		flowId: search.flow,
		snapshotId: search.version,
		stackId: search.stack,
		range: search.range,
		search: search.q,
		sort: search.sort,
		page: search.page,
		pageSize: DEFAULT_GLOBAL_EXECUTIONS_PAGE_SIZE,
	};

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
		search.status !== "all" ||
		search.flow !== undefined ||
		search.version !== undefined ||
		search.stack !== undefined ||
		search.range !== "all" ||
		search.q !== "";

	const onClearFilters = () => {
		onFilterChange({
			status: "all",
			flowId: undefined,
			snapshotId: undefined,
			stackId: undefined,
			range: "all",
			search: "",
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
							params={params}
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
