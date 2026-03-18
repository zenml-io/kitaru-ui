import * as React from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import type { Execution } from "../domain/execution";
import {
	SortableHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/Table/Table";
import {
	StatusRenderer,
	TextRenderer,
	UserRenderer,
} from "@/shared/ui/Table/CellRenderer";
import { ExecutionName } from "../ui/ExecutionName";
import { Link } from "@tanstack/react-router";

export function ExecutionsTableContainer({
	executionRows,
	flowId,
}: {
	executionRows: Execution[];
	flowId: string;
}) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);

	const columns = buildExecutionColumns(flowId);

	const table = useReactTable({
		data: executionRows,
		columns,
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
							No executions match the current filters.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

function buildExecutionColumns(flowId: string): ColumnDef<Execution>[] {
	return [
		{
			accessorKey: "execution",
			header: ({ column }) => (
				<SortableHeader column={column} label="Execution" />
			),
			cell: ({ row }) => (
				<Link
					to="/flows/$flowId/executions/$executionId"
					params={{ flowId, executionId: row.original.id }}
					className="hover:underline"
				>
					<ExecutionName index={row.original.index} />
				</Link>
			),
		},
		{
			accessorKey: "status",
			header: ({ column }) => <SortableHeader column={column} label="Status" />,
			cell: ({ row }) => <StatusRenderer status={row.original.status} />,
		},
		{
			accessorKey: "id",
			header: ({ column }) => <SortableHeader column={column} label="ID" />,
			cell: ({ row }) => <TextRenderer>{row.original.id}</TextRenderer>,
		},
		{
			accessorKey: "Author",
			header: ({ column }) => <SortableHeader column={column} label="Author" />,
			cell: ({ row }) => (
				<UserRenderer
					name={row.original.user?.name ?? ""}
					avatarUrl={row.original.user?.avatarUrl}
				/>
			),
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<SortableHeader column={column} label="Created" />
			),
			cell: ({ row }) => (
				<TextRenderer>
					{row.original.createdAt?.toLocaleString() ?? "-"}
				</TextRenderer>
			),
		},
	];
}
