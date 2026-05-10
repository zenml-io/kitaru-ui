import { Suspense } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import { GlobalExecutionsHeader } from "../ui/GlobalExecutionsHeader";
import { GlobalExecutionsTableSkeleton } from "../ui/GlobalExecutionsTableSkeleton";
import { GlobalExecutionsTableContainer } from "./GlobalExecutionsTableContainer";
import { GlobalExecutionsFilterBarContainer } from "./GlobalExecutionsFilterBarContainer";
import { GlobalExecutionsPaginationContainer } from "./GlobalExecutionsPaginationContainer";
import {
	DEFAULT_GLOBAL_EXECUTIONS_PAGE_SIZE,
	type GlobalExecutionsQueryParams,
	type GlobalExecutionsRange,
} from "../domain/global-executions-query-params";
import type { ExecutionStatusFilter } from "../domain/execution";
import { Skeleton } from "@/shared/ui/skeleton";
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

	const onFilterChange = (next: {
		status?: ExecutionStatusFilter;
		flowId?: string;
		snapshotId?: string;
		stackId?: string;
		range?: GlobalExecutionsRange;
		search?: string;
	}) => {
		void navigate({
			to: "/executions",
			search: (prev) => ({
				...prev,
				status: "status" in next ? (next.status ?? prev.status) : prev.status,
				flow: "flowId" in next ? next.flowId : prev.flow,
				version: "snapshotId" in next ? next.snapshotId : prev.version,
				stack: "stackId" in next ? next.stackId : prev.stack,
				range: "range" in next ? (next.range ?? prev.range) : prev.range,
				q: "search" in next ? (next.search ?? prev.q) : prev.q,
				page: 1,
			}),
			replace: true,
		});
	};

	return (
		<div className="flex h-full flex-col">
			<GlobalExecutionsHeader />
			<Suspense fallback={<FilterBarSkeleton />}>
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
						<GlobalExecutionsTableContainer
							params={params}
							sorting={sortingState}
							onSortingChange={onSortingChange}
						/>
						<GlobalExecutionsPaginationContainer
							params={params}
							onPageChange={onPageChange}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
}

function FilterBarSkeleton() {
	return (
		<div className="border-border bg-card flex gap-2 border-b px-4 py-2.5 sm:px-6 lg:px-8">
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-8 w-24" />
			))}
		</div>
	);
}
