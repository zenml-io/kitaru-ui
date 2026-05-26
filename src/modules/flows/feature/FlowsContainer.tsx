import { useDebouncedValue } from "@/shared/business-logic/use-debounced-value";
import { useManualRefresh } from "@/shared/business-logic/use-manual-refresh";
import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from "@/shared/ui/PageHeader";
import { useSorting } from "@/shared/business-logic/use-sorting";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useFilteredFlows, useFlows } from "../business-logic/use-flows";
import { categorizeFlowStatus } from "../business-logic/categorize-flow-status";
import { DEFAULT_FLOWS_SORT } from "../business-logic/flows-queries";
import { FlowsToolbar } from "../ui/FlowsToolbar";
import type { StatProps } from "../ui/Stat";
import { Stats } from "../ui/Stats";
import { FlowsTableContainer } from "./FlowsTableContainer";

const SEARCH_DEBOUNCE_MS = 300;

export function FlowsContainer() {
	const router = useRouter();
	const { q, status, sort } = useSearch({ from: "/_private/_navbar/flows/" });

	const { flowsData: allFlows, refetch: refetchAll } = useFlows({
		refetchInterval: 5000,
	});

	const debouncedQuery = useDebouncedValue(q, SEARCH_DEBOUNCE_MS);
	const { flowsData: filteredRows, refetch } = useFilteredFlows(
		{ name: debouncedQuery, status, sort },
		{ refetchInterval: 5000 }
	);

	const { sortingState, onSortingChange } = useSorting(
		sort,
		DEFAULT_FLOWS_SORT,
		(nextSort) => {
			router.navigate({
				to: "/flows",
				search: { q, status, sort: nextSort },
				replace: true,
			});
		}
	);

	const { refresh: refreshFlows, isPending: isManualRefreshPending } =
		useManualRefresh(async () => {
			await Promise.all([refetchAll(), refetch()]);
		});

	const statsCounts = allFlows.reduce(
		(acc, flow) => {
			const category = categorizeFlowStatus(flow.latestExecStatus);
			if (category === "running") acc.running++;
			else if (category === "failed") acc.failed++;
			else if (category === "completed") acc.completed++;
			return acc;
		},
		{ running: 0, failed: 0, completed: 0 }
	);

	const stats: StatProps[] = [
		{ label: "Total", value: allFlows.length },
		{ label: "Running", value: statsCounts.running, valueColor: "warning" },
		{ label: "Failed", value: statsCounts.failed, valueColor: "danger" },
		{ label: "Completed", value: statsCounts.completed, valueColor: "success" },
	];

	return (
		<>
			<PageHeader>
				<PageHeaderContent>
					<PageHeaderBody>
						<PageHeaderTitle>Flows</PageHeaderTitle>
						<PageHeaderDescription>Manage your flows</PageHeaderDescription>
					</PageHeaderBody>
					{stats.length > 0 ? (
						<PageHeaderActions>
							<Stats stats={stats} />
						</PageHeaderActions>
					) : null}
				</PageHeaderContent>
			</PageHeader>
			<FlowsToolbar
				onRefresh={refreshFlows}
				isRefreshing={isManualRefreshPending}
				searchValue={q}
				statusFilter={status}
				onSearchValueChange={(value) => {
					router.navigate({
						to: "/flows",
						search: { q: value, status, sort },
						replace: true,
					});
				}}
				onStatusFilterChange={(value) => {
					router.navigate({
						to: "/flows",
						search: { q, status: value, sort },
						replace: true,
					});
				}}
			/>
			<div className="container mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<FlowsTableContainer
					flowRows={filteredRows}
					sorting={sortingState}
					onSortingChange={onSortingChange}
				/>
			</div>
		</>
	);
}
