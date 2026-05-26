import { AlertTriangle } from "lucide-react";
import { Button } from "@zenml/hashi/primitives/button";

type ExecutionLogsStaleBannerProps = {
	onRetry: () => void;
};

export function ExecutionLogsStaleBanner({
	onRetry,
}: ExecutionLogsStaleBannerProps) {
	return (
		<div
			role="status"
			className="border-border bg-warning/10 text-warning flex shrink-0 items-center gap-2 border-b px-3 py-1.5 text-xs"
		>
			<AlertTriangle className="size-3.5 shrink-0" />
			<span className="flex-1">
				Live updates paused — couldn't reach the server.
			</span>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				onClick={onRetry}
				className="h-6 px-2 text-xs"
			>
				Retry
			</Button>
		</div>
	);
}
