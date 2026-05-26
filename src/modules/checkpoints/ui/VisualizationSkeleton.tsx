import { Skeleton } from "@zenml/hashi/primitives/skeleton";

export function VisualizationSkeleton() {
	return (
		<div className="flex flex-col gap-2 p-4">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
			<Skeleton className="h-16 w-2/3" />
		</div>
	);
}
