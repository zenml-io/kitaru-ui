import { Skeleton } from "@zenml/hashi/primitives/skeleton";

export function LogsListSkeleton() {
	return (
		<div className="flex flex-col gap-1 p-2.5">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="flex items-center gap-2">
					<Skeleton className="h-4 w-12 rounded" />
					<Skeleton className="h-4 w-20 rounded" />
					<Skeleton className="h-4 flex-1 rounded" />
				</div>
			))}
		</div>
	);
}
