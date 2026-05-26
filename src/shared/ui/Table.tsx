import * as React from "react";

import type { Column } from "@tanstack/react-table";

import { Button } from "@zenml/hashi/primitives/button";
import { cn } from "@/shared/utils/styles";

function TableContainer({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="table-container"
			className={cn("relative w-full overflow-x-auto", className)}
			{...props}
		/>
	);
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<div
			data-slot="table-container"
			className="relative w-full overflow-x-auto"
		>
			<table
				data-slot="table"
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot="table-header"
			className={cn("[&_tr]:border-b", className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
				className
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
				className
			)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				"text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				"px-2 py-3.5 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className
			)}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot="table-caption"
			className={cn("text-muted-foreground mt-4 text-sm", className)}
			{...props}
		/>
	);
}

function SortableHeader<RowData>({
	column,
	label,
}: {
	column: Column<RowData, unknown>;
	label: string;
}) {
	const sortDirection = column.getIsSorted();
	const toggleSortingHandler = column.getToggleSortingHandler();
	const sortIndicator =
		sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : null;

	return (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			disabled={!column.getCanSort()}
			className={cn(
				"hover:text-foreground -ml-2 h-auto px-2 py-1",
				sortDirection ? "text-foreground" : "text-muted-foreground"
			)}
			onClick={toggleSortingHandler}
		>
			<span>{label}</span>
			{sortIndicator ? (
				<span
					aria-hidden="true"
					className="ml-1 text-xs leading-none opacity-80"
				>
					{sortIndicator}
				</span>
			) : null}
		</Button>
	);
}

export {
	SortableHeader,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
};
