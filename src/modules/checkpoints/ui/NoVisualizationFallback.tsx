import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@zenml/hashi/primitives/empty";
import { Archive } from "lucide-react";

export function NoVisualizationFallback() {
	return (
		<Empty className="gap-2 p-6">
			<EmptyHeader className="gap-1">
				<EmptyMedia variant="icon" className="mb-1 size-8 rounded-full">
					<Archive className="size-4" />
				</EmptyMedia>
				<EmptyTitle className="text-sm">No visualization available</EmptyTitle>
			</EmptyHeader>
		</Empty>
	);
}
