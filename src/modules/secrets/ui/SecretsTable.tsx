import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
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
import { cn } from "@/shared/utils/styles";

import type { Secret } from "../domain/secrets";
import { SecretInfoTooltip } from "./SecretInfoTooltip";

type SecretsTableProps = {
	secrets: Secret[];
	renderActions?: (secret: Secret) => ReactNode;
};

export function SecretsTable({ secrets, renderActions }: SecretsTableProps) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);

	const columns = createColumns(renderActions);

	const table = useReactTable({
		data: secrets,
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
				{table.getRowModel().rows.length ? (
					table.getRowModel().rows.map((row) => (
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
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No secrets yet.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

function createColumns(
	renderActions?: (secret: Secret) => ReactNode
): ColumnDef<Secret>[] {
	const columns: ColumnDef<Secret>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => <SortableHeader column={column} label="Secret" />,
			cell: ({ row }) => {
				const secret = row.original;
				return (
					<div className="flex items-center gap-2">
						<Lock className="text-muted-foreground size-4" />
						<Link
							to="/settings/secrets/$secretId"
							params={{ secretId: secret.id }}
							className={cn(
								"flex flex-col text-sm no-underline hover:underline",
								"text-foreground"
							)}
						>
							<span className="flex items-center gap-1 font-medium">
								{secret.name}
								<SecretInfoTooltip secretName={secret.name} />
							</span>
							<span className="text-muted-foreground font-mono text-xs">
								{secret.shortId}
							</span>
						</Link>
					</div>
				);
			},
		},
		{
			accessorKey: "user.resolvedName",
			header: ({ column }) => <SortableHeader column={column} label="Author" />,
			cell: ({ row }) => (
				<TextRenderer>{row.original.user?.resolvedName ?? "-"}</TextRenderer>
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
