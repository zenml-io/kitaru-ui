import * as React from "react";

import {
	PageHeader,
	PageHeaderActions,
	PageHeaderBody,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from "@/shared/ui/PageHeader";
import type { FlowRow } from "../domain/flow-row";
import type { StatProps } from "../ui/Stat";
import { FlowsToolbar } from "../ui/FlowsToolbar";
import { Stats } from "../ui/Stats";
import { useRouter, useSearch } from "@tanstack/react-router";
import { FlowsTableContainer } from "./FlowsTableContainer";

export function FlowsContainer() {
	const router = useRouter();
	const { q, status } = useSearch({ from: "/_private/_navbar/flows" });

	// TODO: Get stats from API
	const stats: StatProps[] = [
		{ label: "Total", value: 12 },
		{ label: "Running", value: 3, valueColor: "success" },
		{ label: "Failed", value: 1, valueColor: "danger" },
		{ label: "Completed", value: 8, valueColor: "success" },
	];

	// TODO: Get flows from API
	const flowRows = React.useMemo<FlowRow[]>(
		() => [
			{
				id: "flow_001",
				name: "Revenue Sync",
				description: "Syncs daily revenue and settlement data into finance.",
				status: "running",
				lastExecutedAt: "2026-03-10T10:42:00Z",
				executions: 1248,
				averageCostUsd: 12.4,
			},
			{
				id: "flow_002",
				name: "Orders Backfill",
				description:
					"Replays missed order events into downstream analytics tables.",
				status: "completed",
				lastExecutedAt: "2026-03-10T09:55:00Z",
				executions: 386,
				averageCostUsd: 41.9,
			},
			{
				id: "flow_003",
				name: "Warehouse Health Check",
				description:
					"Validates freshness, latency, and row counts across core marts.",
				status: "completed",
				lastExecutedAt: "2026-03-10T09:12:00Z",
				executions: 912,
				averageCostUsd: 7.8,
			},
			{
				id: "flow_004",
				name: "Customer Segments Refresh",
				description:
					"Rebuilds customer segment assignments for growth campaigns.",
				status: "running",
				lastExecutedAt: "2026-03-10T08:44:00Z",
				executions: 275,
				averageCostUsd: 18.6,
			},
			{
				id: "flow_005",
				name: "Failed Payment Retry",
				description:
					"Retries failed payment intents and updates billing states.",
				status: "failed",
				lastExecutedAt: "2026-03-10T08:03:00Z",
				executions: 143,
				averageCostUsd: 9.7,
			},
			{
				id: "flow_006",
				name: "CRM Export",
				description: "Publishes enriched account and contact records to CRM.",
				status: "completed",
				lastExecutedAt: "2026-03-09T18:24:00Z",
				executions: 521,
				averageCostUsd: 14.1,
			},
			{
				id: "flow_007",
				name: "Feature Flag Snapshot",
				description:
					"Captures the active feature flag matrix for audit purposes.",
				status: "completed",
				lastExecutedAt: "2026-03-09T17:58:00Z",
				executions: 2074,
				averageCostUsd: 3.2,
			},
			{
				id: "flow_008",
				name: "Search Index Refresh",
				description: "Refreshes product, doc, and support indexes for search.",
				status: "completed",
				lastExecutedAt: "2026-03-09T16:37:00Z",
				executions: 667,
				averageCostUsd: 26.4,
			},
			{
				id: "flow_009",
				name: "Partner Usage Report",
				description: "Generates metered usage extracts for partner billing.",
				status: "completed",
				lastExecutedAt: "2026-03-09T15:16:00Z",
				executions: 189,
				averageCostUsd: 32.7,
			},
			{
				id: "flow_010",
				name: "Release Notes Publish",
				description: "Collects shipped changes and publishes release notes.",
				status: "completed",
				lastExecutedAt: "2026-03-09T14:03:00Z",
				executions: 84,
				averageCostUsd: 5.5,
			},
			{
				id: "flow_011",
				name: "Pipeline Audit Trail",
				description:
					"Stores signed pipeline execution metadata for compliance.",
				status: "running",
				lastExecutedAt: "2026-03-09T12:41:00Z",
				executions: 1422,
				averageCostUsd: 11.3,
			},
			{
				id: "flow_012",
				name: "Monthly Invoices Rollup",
				description:
					"Aggregates invoice line items into monthly finance summaries.",
				status: "completed",
				lastExecutedAt: "2026-03-09T11:22:00Z",
				executions: 58,
				averageCostUsd: 21.8,
			},
		],
		[]
	);

	const filteredRows = React.useMemo(() => {
		const normalizedSearch = q.trim().toLowerCase();

		return flowRows.filter((flow) => {
			const matchesStatus = status === "all" ? true : flow.status === status;
			const matchesSearch =
				normalizedSearch.length === 0
					? true
					: [flow.id, flow.name, flow.description].some((value) =>
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
