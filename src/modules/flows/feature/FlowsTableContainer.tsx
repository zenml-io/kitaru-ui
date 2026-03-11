import * as React from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import type { FlowRow } from "../domain/flow-row";
import type { FlowStatus } from "../domain/flow-status";
import { StatusDot } from "@/shared/ui/StatusDot";
import {
	SortableHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/Table";
import { formatRelativeTime } from "@/shared/utils/time";

export function FlowsTableContainer({ flowRows }: { flowRows: FlowRow[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "lastExecutedAt", desc: true },
	]);

	const table = useReactTable({
		data: flowRows,
		columns: flowColumns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getRowId: (row) => row.id,
	});

	const headerGroups = table.getHeaderGroups();
	const rows = table.getRowModel().rows;
	const emptyColSpan = table.getVisibleLeafColumns().length;

	return (
		<div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
			<Table>
				<TableHeader>
					{headerGroups.map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{rows.length > 0 ? (
						rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={emptyColSpan}
								className="text-muted-foreground py-10 text-center text-sm"
							>
								No flows match the current filters.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

const flowColumns: ColumnDef<FlowRow>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
		cell: ({ row }) => (
			<span className="text-foreground font-medium">{row.original.name}</span>
		),
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<SortableHeader column={column} label="Description" />
		),
		cell: ({ row }) => (
			<span className="text-muted-foreground block max-w-xl truncate text-sm">
				{row.original.description}
			</span>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => <SortableHeader column={column} label="Status" />,
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				{getFlowStatusDot(row.original.status)}
				<span className="text-foreground text-sm capitalize">
					{row.original.status}
				</span>
			</div>
		),
	},
	{
		accessorKey: "lastExecutedAt",
		header: ({ column }) => (
			<SortableHeader column={column} label="Last Exec" />
		),
		cell: ({ row }) => (
			<span className="text-muted-foreground font-mono text-xs">
				{formatRelativeTime(row.original.lastExecutedAt)}
			</span>
		),
	},
	{
		accessorKey: "executions",
		header: ({ column }) => <SortableHeader column={column} label="Execs" />,
		cell: ({ row }) => (
			<span className="text-muted-foreground font-mono text-xs">
				{row.original.executions}
			</span>
		),
	},
	{
		accessorKey: "averageCostUsd",
		header: ({ column }) => <SortableHeader column={column} label="Avg Cost" />,
		cell: ({ row }) => (
			<span className="text-muted-foreground font-mono text-xs">
				{row.original.averageCostUsd}
			</span>
		),
	},
];

function getFlowStatusDot(status: FlowStatus) {
	if (status === "completed") {
		return <StatusDot variant="success" />;
	}

	if (status === "failed") {
		return <StatusDot variant="danger" />;
	}

	return <StatusDot variant="warning" />;
}
