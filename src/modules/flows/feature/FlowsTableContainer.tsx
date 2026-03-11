import * as React from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import type { FlowRow } from "../domain/flow-row";
import {
	SortableHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/Table/Table";
import { formatRelativeTime } from "@/shared/utils/time";
import {
	MetricValueRenderer,
	StatusRenderer,
	TextRenderer,
} from "@/shared/ui/Table/CellRenderer";

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
	);
}

const flowColumns: ColumnDef<FlowRow>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
		cell: ({ row }) => <TextRenderer>{row.original.name}</TextRenderer>,
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<SortableHeader column={column} label="Description" />
		),
		cell: ({ row }) => (
			<TextRenderer variant="muted">{row.original.description}</TextRenderer>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => <SortableHeader column={column} label="Status" />,
		cell: ({ row }) => <StatusRenderer status={row.original.status} />,
	},
	{
		accessorKey: "lastExecutedAt",
		header: ({ column }) => (
			<SortableHeader column={column} label="Last Exec" />
		),
		cell: ({ row }) => (
			<MetricValueRenderer>
				{formatRelativeTime(row.original.lastExecutedAt)}
			</MetricValueRenderer>
		),
	},
	{
		accessorKey: "executions",
		header: ({ column }) => <SortableHeader column={column} label="Execs" />,
		cell: ({ row }) => (
			<MetricValueRenderer>{row.original.executions}</MetricValueRenderer>
		),
	},
	{
		accessorKey: "averageCostUsd",
		header: ({ column }) => <SortableHeader column={column} label="Avg Cost" />,
		cell: ({ row }) => (
			<MetricValueRenderer>{row.original.averageCostUsd}</MetricValueRenderer>
		),
	},
];
