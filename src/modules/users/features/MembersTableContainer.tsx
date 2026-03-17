import {
	SortableHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/Table";
import { TextRenderer, UserRenderer } from "@/shared/ui/Table/CellRenderer";
import { Badge } from "@/shared/ui/badge";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { userQueries } from "../business-logic/user-queries";
import type { User } from "../domain/users";

export function MembersTableContainer() {
	const { data } = useSuspenseQuery(userQueries.list());

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);

	const table = useReactTable({
		data: data.items,
		columns: columns,
		state: {
			sorting,
		},
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
						{headerGroup.headers.map((header) => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
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
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <SortableHeader column={column} label="Name" />,
		cell: ({ row }) => (
			<UserRenderer
				name={row.original.name}
				avatarUrl={row.original.avatarUrl}
			/>
		),
	},
	{
		accessorKey: "isAdmin",
		header: ({ column }) => <SortableHeader column={column} label="Role" />,
		cell: ({ row }) => (
			<TextRenderer>
				<Badge variant="outline">
					{row.original.isAdmin ? "Admin" : "Member"}
				</Badge>
			</TextRenderer>
		),
	},
	{
		accessorKey: "isActive",
		header: ({ column }) => <SortableHeader column={column} label="Status" />,
		cell: ({ row }) => {
			const isActive = row.original.isActive;
			return (
				<TextRenderer>
					<Badge variant={isActive ? "success" : "secondary"}>
						{isActive ? "Active" : "Inactive"}
					</Badge>
				</TextRenderer>
			);
		},
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
