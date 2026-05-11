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
import { Button } from "@/shared/ui/button";
import { ExecutionName } from "./ExecutionName";
import type { GlobalExecutionsTableRow } from "../business-logic/to-global-executions-rows";

type GlobalExecutionsTableProps = {
	rows: GlobalExecutionsTableRow[];
	sorting: SortingState;
	onSortingChange: (state: SortingState) => void;
	hasActiveFilters: boolean;
	onClearFilters: () => void;
};

export function GlobalExecutionsTable({
	rows,
	sorting,
	onSortingChange,
	hasActiveFilters,
	onClearFilters,
}: GlobalExecutionsTableProps) {
	const table = useReactTable({
		data: rows,
		columns: GLOBAL_EXECUTION_COLUMNS,
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
	const tableRows = table.getRowModel().rows;
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
				{tableRows.length > 0 ? (
					tableRows.map((row) => (
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
						<TableCell colSpan={emptyColSpan} className="py-10 text-center">
							<div className="flex flex-col items-center gap-3">
								<p className="text-muted-foreground text-sm">
									No executions match the current filters.
								</p>
								{hasActiveFilters ? (
									<Button variant="outline" size="sm" onClick={onClearFilters}>
										Clear filters
									</Button>
								) : null}
							</div>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

const GLOBAL_EXECUTION_COLUMNS: ColumnDef<GlobalExecutionsTableRow>[] = [
	{
		id: "execution",
		meta: { isPrimaryColumn: true },
		header: () => "Execution",
		enableSorting: false,
		cell: ({ row }) => {
			const { flowId, versionForLink, executionIndex } = row.original;
			if (!flowId) {
				return (
					<span className="block px-2 py-3.5">
						<ExecutionName index={executionIndex} />
					</span>
				);
			}
			return (
				<Link
					to="/flows/$flowId/v/$version/executions/$executionId"
					params={{
						flowId,
						version: versionForLink,
						executionId: row.original.id,
					}}
					className="block px-2 py-3.5 hover:underline"
				>
					<ExecutionName index={executionIndex} />
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
			const { flowId, flowName } = row.original;
			if (!flowId) return <TextRenderer>—</TextRenderer>;
			return (
				<Link
					to="/flows/$flowId"
					params={{ flowId }}
					className="hover:underline"
				>
					<TextRenderer>{flowName ?? flowId}</TextRenderer>
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
		header: () => "Version",
		enableSorting: false,
		cell: ({ row }) => (
			<span className="border-border bg-muted/40 text-foreground inline-flex h-5 items-center rounded border px-1.5 font-mono text-xs font-semibold">
				{row.original.versionLabel}
			</span>
		),
	},
	{
		id: "status",
		accessorFn: (row) => row.status,
		header: ({ column }) => <SortableHeader column={column} label="Status" />,
		cell: ({ row }) => <StatusRenderer status={row.original.status} />,
	},
	{
		id: "created",
		accessorFn: (row) => row.dateLabel,
		header: ({ column }) => <SortableHeader column={column} label="Date" />,
		cell: ({ row }) => <TextRenderer>{row.original.dateLabel}</TextRenderer>,
	},
	{
		id: "author",
		accessorFn: (row) => row.authorName,
		header: () => "Author",
		enableSorting: false,
		cell: ({ row }) => (
			<UserRenderer
				name={row.original.authorName}
				avatarUrl={row.original.authorAvatarUrl}
			/>
		),
	},
];
