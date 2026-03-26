import { Skeleton } from "@/shared/ui/skeleton";

export function VisualizationSkeleton() {
	return (
		<div className="flex flex-col gap-3 p-4">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
			<Skeleton className="h-32 w-full" />
		</div>
	);
}
