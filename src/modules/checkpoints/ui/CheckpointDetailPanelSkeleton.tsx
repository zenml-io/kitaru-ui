import { Skeleton } from "@/shared/ui/skeleton";

export function CheckpointDetailPanelSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="border-border bg-card shrink-0 border-b">
				<div className="flex h-10 shrink-0 items-center gap-2 px-4">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-32" />
				</div>
				<div className="flex h-9 shrink-0 items-center gap-4 px-4">
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-3 w-16" />
				</div>
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
