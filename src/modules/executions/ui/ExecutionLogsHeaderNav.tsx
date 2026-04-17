import { ArrowLeft, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

type ExecutionLogsHeaderNavProps = {
	sidebar: { open: boolean; onToggle: () => void };
	onBack: () => void;
	withTrailingSeparator?: boolean;
};

export function ExecutionLogsHeaderNav({
	sidebar,
	onBack,
	withTrailingSeparator = false,
}: ExecutionLogsHeaderNavProps) {
	return (
		<>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label={
					sidebar.open ? "Close executions list" : "Open executions list"
				}
				className="size-8"
				onClick={sidebar.onToggle}
			>
				{sidebar.open ? (
					<PanelLeft className="size-4" />
				) : (
					<PanelRight className="size-4" />
				)}
			</Button>
			<Separator orientation="vertical" className="h-5" />
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="gap-1.5"
				onClick={onBack}
			>
				<ArrowLeft className="size-3.5" />
				Execution
			</Button>
			{withTrailingSeparator && (
				<Separator orientation="vertical" className="h-5" />
			)}
		</>
	);
}
