import * as React from "react";

import { cn } from "@/shared/utils/styles";

export function PageHeader({
	className,
	...props
}: React.ComponentProps<"header">) {
	return (
		<header
			data-slot="page-header"
			className={cn(
				"bg-card border-border w-full shrink-0 border-b",
				className
			)}
			{...props}
		/>
	);
}

export function PageHeaderContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="page-header-content"
			className={cn(
				"container mx-auto flex flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:px-8",
				className
			)}
			{...props}
		/>
	);
}

export function PageHeaderBody({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="page-header-body"
			className={cn("flex min-w-0 flex-col gap-1", className)}
			{...props}
		/>
	);
}

export function PageHeaderTitle({
	className,
	...props
}: React.ComponentProps<"h1">) {
	return (
		<h1
			data-slot="page-header-title"
			className={cn(
				"text-foreground text-2xl font-bold tracking-tight text-balance",
				className
			)}
			{...props}
		/>
	);
}

export function PageHeaderDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="page-header-description"
			className={cn(
				"text-muted-foreground mt-0.5 max-w-2xl text-sm text-pretty",
				className
			)}
			{...props}
		/>
	);
}

export function PageHeaderActions({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="page-header-actions"
			className={cn("flex min-w-0 items-start", className)}
			{...props}
		/>
	);
}
