import { AlertCircle } from "lucide-react";
import { Button } from "@zenml/hashi/primitives/button";
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zenml/hashi/primitives/empty";

type ExecutionLogsErrorStateProps = {
	error: unknown;
	onRetry: () => void;
};

export function ExecutionLogsErrorState({
	error,
	onRetry,
}: ExecutionLogsErrorStateProps) {
	const message = error instanceof Error ? error.message : "Unknown error";
	return (
		<Empty data-testid="execution-logs-error">
			<EmptyHeader className="max-w-md">
				<EmptyMedia
					variant="icon"
					className="bg-destructive/10 text-destructive ring-destructive/20 size-14 rounded-full ring-1"
				>
					<AlertCircle className="size-7" />
				</EmptyMedia>
				<EmptyTitle>Failed to load logs</EmptyTitle>
			</EmptyHeader>
			<EmptyContent>
				<div className="border-border text-muted-foreground bg-muted/30 w-full max-w-lg rounded-lg border px-5 py-4 text-left font-mono text-xs text-pretty">
					{message}
				</div>
				<Button variant="outline" size="sm" onClick={onRetry}>
					Retry
				</Button>
			</EmptyContent>
		</Empty>
	);
}
