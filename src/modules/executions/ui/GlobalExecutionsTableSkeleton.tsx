import { Skeleton } from "@/shared/ui/skeleton";

const ROW_COUNT = 8;

export function GlobalExecutionsTableSkeleton() {
	return (
		<div className="flex flex-col gap-2 p-4">
			{Array.from({ length: ROW_COUNT }).map((_, i) => (
				<Skeleton key={i} className="h-10 w-full" />
			))}
		</div>
	);
}
