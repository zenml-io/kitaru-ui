import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { Archive } from "@untitledui/icons";

export function NoVisualizationFallback() {
	return (
		<Empty>
			<EmptyHeader className="max-w-md">
				<EmptyMedia variant="icon" className="size-14 rounded-full">
					<Archive className="size-7" />
				</EmptyMedia>
				<EmptyTitle>No visualization available</EmptyTitle>
				<p className="text-muted-foreground text-sm">
					This artifact was saved without a visualization
				</p>
			</EmptyHeader>
		</Empty>
	);
}
