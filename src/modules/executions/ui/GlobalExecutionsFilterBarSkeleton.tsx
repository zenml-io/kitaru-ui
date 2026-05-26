import { Skeleton } from "@zenml/hashi/primitives/skeleton";

const TRIGGER_COUNT = 5;

export function GlobalExecutionsFilterBarSkeleton() {
	return (
		<div className="border-border border-b">
			<div className="container mx-auto flex flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
				{Array.from({ length: TRIGGER_COUNT }).map((_, i) => (
					<Skeleton key={i} className="h-8 w-24" />
				))}
			</div>
		</div>
	);
}
