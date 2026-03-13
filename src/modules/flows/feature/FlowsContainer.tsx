import * as React from "react";

import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from "@/shared/ui/PageHeader";
import { FlowsToolbar } from "../ui/FlowsToolbar";
import { Stats } from "../ui/Stats";
import { useRouter, useSearch } from "@tanstack/react-router";
import { FlowsTableContainer } from "./FlowsTableContainer";
import { useFlows } from "../business-logic/use-flows";
import type { StatProps } from "../ui/Stat";

export function FlowsContainer() {
	const router = useRouter();
	const { q, status } = useSearch({ from: "/_private/_navbar/flows" });

	const { flowsData } = useFlows();

	const statsCounts = flowsData.reduce(
		(acc, flow) => {
			if (flow.latestExecStatus === "running") acc.running++;
			else if (flow.latestExecStatus === "failed") acc.failed++;
			else if (flow.latestExecStatus === "completed") acc.completed++;
			return acc;
		},
		{ running: 0, failed: 0, completed: 0 }
	);

	const stats: StatProps[] = [
		{ label: "Total", value: flowsData.length },
		{ label: "Running", value: statsCounts.running, valueColor: "warning" },
		{ label: "Failed", value: statsCounts.failed, valueColor: "danger" },
		{ label: "Completed", value: statsCounts.completed, valueColor: "success" },
	];

	const filteredRows = React.useMemo(() => {
		const normalizedSearch = q.trim().toLowerCase() ?? "";

		return flowsData.filter((flow) => {
			const matchesStatus =
				status === "all" ? true : flow.latestExecStatus === status;
			const matchesSearch =
				normalizedSearch.length === 0
					? true
					: [flow.id, flow.name].some((value) =>
							value.toLowerCase().includes(normalizedSearch)
						);

			return matchesStatus && matchesSearch;
		});
	}, [flowsData, q, status]);

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
				searchValue={q}
				statusFilter={status}
				onSearchValueChange={(value) => {
					router.navigate({
						to: "/flows",
						search: (previousSearch) => ({
							q: value,
							status: previousSearch.status ?? "all",
						}),
						replace: true,
					});
				}}
				onStatusFilterChange={(value) => {
					router.navigate({
						to: "/flows",
						search: (previousSearch) => ({
							q: previousSearch.q ?? "",
							status: value,
						}),
						replace: true,
					});
				}}
			/>
			<div className="container mx-auto flex w-full flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
				<FlowsTableContainer flowRows={filteredRows} />
			</div>
		</>
	);
}
