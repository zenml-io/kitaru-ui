import { Skeleton } from "@/shared/ui/skeleton";

export function CheckpointDetailPanelSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="border-border flex h-10 shrink-0 items-center gap-2 border-b px-4">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="border-border flex h-9 shrink-0 items-center gap-4 border-b px-4">
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-3 w-16" />
			</div>
			<div className="space-y-3 p-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex items-center gap-4">
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-3 w-24" />
					</div>
				))}
			</div>
		</div>
	);
}
