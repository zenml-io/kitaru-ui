import type { ReactNode } from "react";
import { Skeleton } from "@/shared/ui/skeleton";

type LogsToolbarSkeletonProps = {
	leading?: ReactNode;
};

export function LogsToolbarSkeleton({ leading }: LogsToolbarSkeletonProps) {
	return (
		<div className="border-border flex shrink-0 items-center gap-2 border-b p-2">
			{leading}
			<Skeleton className="h-8 w-24" />
			<Skeleton className="h-8 min-w-24 flex-1" />
			<Skeleton className="size-8" />
			<Skeleton className="size-8" />
		</div>
	);
}
