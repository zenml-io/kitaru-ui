import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/shared/ui/empty";
import { AlertCircle } from "lucide-react";

type Props = {
	error?: unknown;
};

export function VisualizationErrorFallback({ error }: Props) {
	const errorMessage = error instanceof Error ? error.message : "Unknown error";
	return (
		<Empty>
			<EmptyHeader className="max-w-md">
				<EmptyMedia
					variant="icon"
					className="bg-destructive/10 text-destructive ring-destructive/20 size-14 rounded-full ring-1"
				>
					<AlertCircle className="size-7" />
				</EmptyMedia>
				<EmptyTitle>Something went wrong</EmptyTitle>
			</EmptyHeader>
			<EmptyContent>
				<div className="border-border text-muted-foreground bg-muted/30 w-full max-w-lg rounded-lg border px-5 py-4 text-left font-mono text-xs text-pretty">
					{errorMessage}
				</div>
			</EmptyContent>
		</Empty>
	);
}
