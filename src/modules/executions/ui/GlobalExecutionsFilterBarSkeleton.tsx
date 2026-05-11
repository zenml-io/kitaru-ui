import { Skeleton } from "@/shared/ui/skeleton";

const TRIGGER_COUNT = 5;

export function GlobalExecutionsFilterBarSkeleton() {
	return (
		<div className="border-border bg-card flex gap-2 border-b px-4 py-2.5 sm:px-6 lg:px-8">
			{Array.from({ length: TRIGGER_COUNT }).map((_, i) => (
				<Skeleton key={i} className="h-8 w-24" />
			))}
		</div>
	);
}
