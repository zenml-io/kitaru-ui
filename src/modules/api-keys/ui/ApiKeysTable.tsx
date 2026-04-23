import { KeyRound } from "lucide-react";
import { useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

import {
	SortableHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/Table";
import { TextRenderer } from "@/shared/ui/Table/CellRenderer";

import type { ApiKey } from "../domain/api-key";

type ApiKeysTableProps = {
	apiKeys: ApiKey[];
	renderActions?: (apiKey: ApiKey) => ReactNode;
	renderActiveCell?: (apiKey: ApiKey) => ReactNode;
};

function formatLastLogin(date?: Date) {
	if (!date) return "Never";
	return date.toLocaleString();
}

export function ApiKeysTable({
	apiKeys,
	renderActions,
	renderActiveCell,
}: ApiKeysTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const columns = createColumns({ renderActions, renderActiveCell });

	const table = useReactTable({
		data: apiKeys,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getRowId: (row) => row.id,
	});

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
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
				{table.getRowModel().rows.map((row) => (
					<TableRow key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function createColumns({
	renderActions,
	renderActiveCell,
}: {
	renderActions?: (apiKey: ApiKey) => ReactNode;
	renderActiveCell?: (apiKey: ApiKey) => ReactNode;
}): ColumnDef<ApiKey>[] {
	const columns: ColumnDef<ApiKey>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => <SortableHeader column={column} label="Name" />,
			cell: ({ row }) => {
				const apiKey = row.original;
				return (
					<div className="flex items-start gap-2">
						<KeyRound className="text-muted-foreground mt-0.5 size-4" />
						<div className="flex flex-col text-sm">
							<span className="text-foreground font-medium">{apiKey.name}</span>
							{apiKey.description && (
								<span className="text-muted-foreground text-xs">
									{apiKey.description}
								</span>
							)}
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "lastLogin",
			header: ({ column }) => (
				<SortableHeader column={column} label="Last used" />
			),
			cell: ({ row }) => (
				<TextRenderer>{formatLastLogin(row.original.lastLogin)}</TextRenderer>
			),
		},
	];

	if (renderActiveCell) {
		columns.push({
			id: "active",
			enableSorting: false,
			header: () => <span>Active</span>,
			cell: ({ row }) => renderActiveCell(row.original),
		});
	}

	if (renderActions) {
		columns.push({
			id: "actions",
			enableSorting: false,
			header: () => <span className="sr-only">Actions</span>,
			cell: ({ row }) => (
				<div className="flex justify-end">{renderActions(row.original)}</div>
			),
		});
	}

	return columns;
}
