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
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { Flow } from "../domain/flow";

function navigateToFlow(
	navigate: ReturnType<typeof useNavigate>,
	flowId: string
) {
	void navigate({
		to: "/flows/$flowId/$tab",
		params: { flowId, tab: "overview" },
	});
}

export function FlowsTableContainer({ flowRows }: { flowRows: Flow[] }) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);
	const navigate = useNavigate();

	const columns = useMemo(() => flowColumns, []);

	const table = useReactTable({
		data: flowRows,
		columns: columns,
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
						<TableRow
							key={row.id}
							onClick={() => navigateToFlow(navigate, row.original.id)}
						>
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

const flowColumns: ColumnDef<Flow>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
		cell: ({ row }) => <TextRenderer>{row.original.name}</TextRenderer>,
	},
	{
		accessorKey: "latestexecutionId",
		header: ({ column }) => (
			<SortableHeader column={column} label="Latest Execution ID" />
		),
		cell: ({ row }) => (
			<TextRenderer>{row.original.latestexecutionId ?? "-"}</TextRenderer>
		),
	},
	{
		accessorKey: "latestExecStatus",
		header: ({ column }) => <SortableHeader column={column} label="Status" />,
		cell: ({ row }) => (
			<StatusRenderer status={row.original.latestExecStatus} />
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <SortableHeader column={column} label="Created" />,
		cell: ({ row }) => (
			<TextRenderer>
				{row.original.createdAt?.toLocaleString() ?? "-"}
			</TextRenderer>
		),
	},
];
