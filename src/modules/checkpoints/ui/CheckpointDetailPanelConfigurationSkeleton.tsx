import { Skeleton } from "@zenml/hashi/primitives/skeleton";

export function CheckpointDetailPanelConfigurationSkeleton() {
	return (
		<div className="flex flex-col gap-4 p-4">
			<Skeleton className="h-3 w-16" />
			<Skeleton className="h-12 w-full rounded-lg" />
			<Skeleton className="h-12 w-full rounded-lg" />
			<Skeleton className="mt-4 h-3 w-24" />
			<Skeleton className="h-32 w-full rounded-lg" />
		</div>
	);
}
