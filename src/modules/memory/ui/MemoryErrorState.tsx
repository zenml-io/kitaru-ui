import { AlertCircle } from "@untitledui/icons";
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/shared/ui/empty";
import { cn } from "@/shared/utils/styles";

type MemoryErrorStateProps = {
	error: unknown;
	className?: string;
};

export function MemoryErrorState({ error, className }: MemoryErrorStateProps) {
	const errorMessage = error instanceof Error ? error.message : "Unknown error";

	return (
		<Empty className={cn("border-none", className)}>
			<EmptyHeader className="max-w-md">
				<EmptyMedia
					variant="icon"
					className="bg-destructive/10 text-destructive ring-destructive/20 size-14 rounded-full ring-1"
				>
					<AlertCircle className="size-7" />
				</EmptyMedia>
				<EmptyTitle>Failed to load memory</EmptyTitle>
			</EmptyHeader>
			<EmptyContent>
				<div className="border-border text-muted-foreground bg-muted/30 w-full max-w-lg rounded-lg border px-5 py-4 text-left font-mono text-xs text-pretty">
					{errorMessage}
				</div>
			</EmptyContent>
		</Empty>
	);
}
