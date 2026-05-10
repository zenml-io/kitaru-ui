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
	useReactTable,
} from "@tanstack/react-table";
import type { Execution } from "../domain/execution";
import { ExecutionName } from "./ExecutionName";
import {
	type Deployment,
	formatVersion,
	LOCAL_VERSION_ID,
} from "@/modules/deployments/domain/deployment";

export type SnapshotVersionLookup = Map<string, Deployment>;

type GlobalExecutionsTableProps = {
	executions: Execution[];
	versionLookup: SnapshotVersionLookup;
	sorting: SortingState;
	onSortingChange: (state: SortingState) => void;
};

export function GlobalExecutionsTable({
	executions,
	versionLookup,
	sorting,
	onSortingChange,
}: GlobalExecutionsTableProps) {
	const columns = buildGlobalExecutionColumns(versionLookup);

	const table = useReactTable({
		data: executions,
		columns,
		state: { sorting },
		onSortingChange: (updater) => {
			onSortingChange(
				typeof updater === "function" ? updater(sorting) : updater
			);
		},
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.id,
		manualSorting: true,
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

function buildGlobalExecutionColumns(
	versionLookup: SnapshotVersionLookup
): ColumnDef<Execution>[] {
	return [
		{
			id: "execution",
			meta: { isPrimaryColumn: true },
			header: () => "Execution",
			enableSorting: false,
			cell: ({ row }) => {
				const flowId = row.original.flowId;
				const lookedUp = row.original.sourceSnapshot?.id
					? versionLookup.get(row.original.sourceSnapshot.id)
					: undefined;
				const linkVersion = lookedUp?.version ?? LOCAL_VERSION_ID;
				if (!flowId) {
					return (
						<span className="block px-2 py-3.5">
							<ExecutionName index={row.original.index} />
						</span>
					);
				}
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
			id: "flow",
			accessorFn: (row) => row.flowName,
			header: () => "Flow",
			enableSorting: false,
			cell: ({ row }) => {
				if (!row.original.flowId) {
					return <TextRenderer>—</TextRenderer>;
				}
				return (
					<Link
						to="/flows/$flowId"
						params={{ flowId: row.original.flowId }}
						className="hover:underline"
					>
						<TextRenderer>
							{row.original.flowName ?? row.original.flowId}
						</TextRenderer>
					</Link>
				);
			},
		},
		{
			id: "stack",
			accessorFn: (row) => row.stackName,
			header: () => "Stack",
			enableSorting: false,
			cell: ({ row }) => (
				<TextRenderer>{row.original.stackName ?? "—"}</TextRenderer>
			),
		},
		{
			id: "version",
			header: "Version",
			enableSorting: false,
			cell: ({ row }) => {
				const lookedUp = row.original.sourceSnapshot?.id
					? versionLookup.get(row.original.sourceSnapshot.id)
					: undefined;
				const version = lookedUp?.version ?? LOCAL_VERSION_ID;
				return <TextRenderer>{formatVersion(version)}</TextRenderer>;
			},
		},
		{
			id: "status",
			accessorFn: (row) => row.status,
			header: ({ column }) => <SortableHeader column={column} label="Status" />,
			cell: ({ row }) => <StatusRenderer status={row.original.status} />,
		},
		{
			id: "created",
			accessorFn: (row) => row.createdAt,
			header: ({ column }) => <SortableHeader column={column} label="Date" />,
			cell: ({ row }) => (
				<TextRenderer>
					{row.original.createdAt?.toLocaleString() ?? "—"}
				</TextRenderer>
			),
		},
		{
			id: "author",
			accessorFn: (row) => row.user?.name,
			header: () => "Author",
			enableSorting: false,
			cell: ({ row }) => (
				<UserRenderer
					name={row.original.user?.name ?? ""}
					avatarUrl={row.original.user?.avatarUrl}
				/>
			),
		},
	];
}
