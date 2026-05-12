import { StatusRenderer, TextRenderer } from "@/shared/ui/Table/CellRenderer";
import {
	SortableHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/Table/Table";
import { Link } from "@tanstack/react-router";
import type {
	ColumnDef,
	OnChangeFn,
	SortingState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { Flow } from "../domain/flow";

type FlowsTableContainerProps = {
	flowRows: Flow[];
	sorting: SortingState;
	onSortingChange: OnChangeFn<SortingState>;
};

export function FlowsTableContainer({
	flowRows,
	sorting,
	onSortingChange,
}: FlowsTableContainerProps) {
	const columns = useMemo(() => flowColumns, []);

	const table = useReactTable({
		data: flowRows,
		columns: columns,
		state: {
			sorting,
		},
		onSortingChange,
		manualSorting: true,
		enableSortingRemoval: false,
		enableMultiSort: false,
		getCoreRowModel: getCoreRowModel(),
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
								<TableCell
									key={cell.id}
									className={
										cell.column.columnDef.meta?.isPrimaryColumn
											? "p-0"
											: undefined
									}
								>
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

const flowColumns: ColumnDef<Flow>[] = [
	{
		id: "name",
		accessorKey: "name",
		meta: { isPrimaryColumn: true },
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
		cell: ({ row }) => (
			<Link
				to="/flows/$flowId"
				params={{ flowId: row.original.id }}
				className="block px-2 py-3.5 hover:underline"
			>
				<TextRenderer>{row.original.name}</TextRenderer>
			</Link>
		),
	},
	{
		id: "latest_run",
		accessorKey: "latestexecutionId",
		header: ({ column }) => (
			<SortableHeader column={column} label="Latest Run" />
		),
		cell: ({ row }) => (
			<TextRenderer>{row.original.latestexecutionId ?? "-"}</TextRenderer>
		),
	},
	{
		id: "latestExecStatus",
		accessorKey: "latestExecStatus",
		enableSorting: false,
		header: () => (
			<span className="text-muted-foreground px-2 py-1 text-sm font-medium">
				Status
			</span>
		),
		cell: ({ row }) => (
			<StatusRenderer status={row.original.latestExecStatus} />
		),
	},
	{
		id: "created",
		accessorKey: "createdAt",
		header: ({ column }) => <SortableHeader column={column} label="Created" />,
		cell: ({ row }) => (
			<TextRenderer>
				{row.original.createdAt?.toLocaleString() ?? "-"}
			</TextRenderer>
		),
	},
];
