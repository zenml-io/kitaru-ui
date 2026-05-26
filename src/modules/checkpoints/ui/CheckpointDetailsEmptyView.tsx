import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
} from "@zenml/hashi/primitives/empty";
import { Info } from "lucide-react";

export function CheckpointDetailsEmptyView() {
	return (
		<Empty className="h-full border-none">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Info className="size-5" />
				</EmptyMedia>
				<EmptyDescription>Select a checkpoint to view details</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
