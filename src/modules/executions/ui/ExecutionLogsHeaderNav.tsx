import { ArrowLeft, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

type ExecutionLogsHeaderNavProps = {
	onBackToExecution?: () => void;
	onToggleSidebar?: () => void;
	sidebarOpen?: boolean;
	withTrailingSeparator?: boolean;
};

export function ExecutionLogsHeaderNav({
	onBackToExecution,
	onToggleSidebar,
	sidebarOpen,
	withTrailingSeparator = false,
}: ExecutionLogsHeaderNavProps) {
	if (!onToggleSidebar && !onBackToExecution) return null;

	return (
		<>
			{onToggleSidebar && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label={
						sidebarOpen ? "Close executions list" : "Open executions list"
					}
					className="size-8"
					onClick={onToggleSidebar}
				>
					{sidebarOpen ? (
						<PanelLeft className="size-4" />
					) : (
						<PanelRight className="size-4" />
					)}
				</Button>
			)}
			{onToggleSidebar && onBackToExecution && (
				<Separator orientation="vertical" className="h-5" />
			)}
			{onBackToExecution && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="gap-1.5"
					onClick={onBackToExecution}
				>
					<ArrowLeft className="size-3.5" />
					Execution
				</Button>
			)}
			{withTrailingSeparator && (
				<Separator orientation="vertical" className="h-5" />
			)}
		</>
	);
}
