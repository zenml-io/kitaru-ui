import {
	StatusRenderer,
	TextRenderer,
	UserRenderer,
} from "@/shared/ui/Table/CellRenderer";
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
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { DeploymentVersion } from "@/modules/deployments/domain/deployment";
import type { Execution } from "../domain/execution";
import { ExecutionName } from "../ui/ExecutionName";
import { ExecutionActionsDropdown } from "../ui/ExecutionActionsDropdown";

export type SnapshotVersionLookup = Map<string, DeploymentVersion>;

export function ExecutionsTableContainer({
	executionRows,
	flowId,
	versionLookup,
	versionParam,
}: {
	executionRows: Execution[];
	flowId: string;
	versionLookup: SnapshotVersionLookup;
	versionParam: DeploymentVersion | undefined;
}) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);

	const columns = useMemo(
		() => buildExecutionColumns(flowId, versionLookup, versionParam),
		[flowId, versionLookup, versionParam]
	);

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
							No executions match the current filters.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

function buildExecutionColumns(
	flowId: string,
	versionLookup: SnapshotVersionLookup,
	versionParam: DeploymentVersion | undefined
): ColumnDef<Execution>[] {
	return [
		{
			accessorKey: "execution",
			meta: { isPrimaryColumn: true },
			header: ({ column }) => (
				<SortableHeader column={column} label="Execution" />
			),
			cell: ({ row }) => {
				const lookedUp = row.original.sourceSnapshot?.id
					? versionLookup.get(row.original.sourceSnapshot.id)
					: undefined;
				const linkVersion = versionParam ?? lookedUp ?? "local";
				return (
					<Link
						to="/flows/$flowId/v/$version/executions/$executionId"
						params={{
							flowId,
							version: linkVersion,
							executionId: row.original.id,
						}}
						className="block px-2 py-3.5 hover:underline"
					>
						<ExecutionName index={row.original.index} />
					</Link>
				);
			},
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
		{
			id: "actions",
			header: () => null,
			cell: ({ row }) => (
				<ExecutionActionsDropdown
					executionId={row.original.id}
					flowId={flowId}
				/>
			),
			enableSorting: false,
		},
	];
}
