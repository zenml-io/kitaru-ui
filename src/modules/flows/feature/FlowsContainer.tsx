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
import { Stats, type StatsProps } from "../ui/Stats";
import { useRouter, useSearch } from "@tanstack/react-router";
import { FlowsTableContainer } from "./FlowsTableContainer";
import { useFlows } from "../business-logic/use-flows";

export function FlowsContainer() {
	const router = useRouter();
	const { q, status } = useSearch({ from: "/_private/_navbar/flows" });

	const { flowRows } = useFlows();

	const stats = React.useMemo<StatsProps>(() => {
		const runningCount = flowRows.filter(
			(flow) => flow.latestExecStatus === "running"
		).length;
		const failedCount = flowRows.filter(
			(flow) => flow.latestExecStatus === "failed"
		).length;
		const completedCount = flowRows.filter(
			(flow) => flow.latestExecStatus === "completed"
		).length;

		return [
			{ label: "Total", value: flowRows.length },
			{ label: "Running", value: runningCount, valueColor: "warning" },
			{ label: "Failed", value: failedCount, valueColor: "danger" },
			{ label: "Completed", value: completedCount, valueColor: "success" },
		];
	}, [flowRows]);

	const filteredRows = React.useMemo(() => {
		const normalizedSearch = q.trim().toLowerCase();

		return flowRows.filter((flow) => {
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
	}, [flowRows, q, status]);

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
