import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { Archive } from "@untitledui/icons";

export function NoVisualizationFallback() {
	return (
		<Empty className="gap-2 p-6">
			<EmptyHeader className="gap-1">
				<EmptyMedia variant="icon" className="mb-1 size-8 rounded-full">
					<Archive className="size-4" />
				</EmptyMedia>
				<EmptyTitle className="text-sm">No visualization available</EmptyTitle>
				<p className="text-muted-foreground text-xs">
					This artifact was saved without a visualization
				</p>
			</EmptyHeader>
		</Empty>
	);
}
