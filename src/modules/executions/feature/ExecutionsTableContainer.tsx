import type { Deployment } from "@/modules/deployments/domain/deployment";
import { LOCAL_VERSION_ID } from "@/modules/deployments/domain/local-deployment";
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
import type { Execution } from "../domain/execution";
import { ExecutionName } from "../ui/ExecutionName";
import { ExecutionActionsDropdown } from "../ui/ExecutionActionsDropdown";

export function ExecutionsTableContainer({
	executionRows,
	flowId,
	realDeployments,
}: {
	executionRows: Execution[];
	flowId: string;
	realDeployments: Deployment[];
}) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);

	const columns = useMemo(
		() => buildExecutionColumns(flowId, realDeployments),
		[flowId, realDeployments]
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
	realDeployments: Deployment[]
): ColumnDef<Execution>[] {
	const deploymentBySnapshotId = new Map(realDeployments.map((d) => [d.id, d]));
	return [
		{
			accessorKey: "execution",
			meta: { isPrimaryColumn: true },
			header: ({ column }) => (
				<SortableHeader column={column} label="Execution" />
			),
			cell: ({ row }) => {
				const deployment = row.original.sourceSnapshot?.id
					? deploymentBySnapshotId.get(row.original.sourceSnapshot.id)
					: undefined;
				const version: number | typeof LOCAL_VERSION_ID = deployment
					? deployment.versionNumber
					: LOCAL_VERSION_ID;
				return (
					<Link
						to="/flows/$flowId/executions/$executionId"
						params={{ flowId, executionId: row.original.id }}
						search={{ version }}
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
