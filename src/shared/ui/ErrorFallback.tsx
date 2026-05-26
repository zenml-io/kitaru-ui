import { AlertCircle } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { Button } from "@zenml/hashi/primitives/button";
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zenml/hashi/primitives/empty";

type ErrorFallbackProps = FallbackProps & {
	title?: string;
};

export function ErrorFallback({
	error,
	resetErrorBoundary,
	title = "Something went wrong",
}: ErrorFallbackProps) {
	const message = error instanceof Error ? error.message : "Unknown error";
	return (
		<Empty>
			<EmptyHeader className="max-w-md">
				<EmptyMedia
					variant="icon"
					className="bg-destructive/10 text-destructive ring-destructive/20 size-14 rounded-full ring-1"
				>
					<AlertCircle className="size-7" />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
			</EmptyHeader>
			<EmptyContent>
				<div className="border-border text-muted-foreground bg-muted/30 w-full max-w-lg rounded-lg border px-5 py-4 text-left font-mono text-xs text-pretty">
					{message}
				</div>
				<Button variant="outline" size="sm" onClick={resetErrorBoundary}>
					Retry
				</Button>
			</EmptyContent>
		</Empty>
	);
}
