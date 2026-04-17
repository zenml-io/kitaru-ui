import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { ToggleLeftPanelButton } from "@/shared/ui/ThreePanelLayoutContext";

type ExecutionLogsHeaderNavProps = {
	onBack: () => void;
	withTrailingSeparator?: boolean;
};

export function ExecutionLogsHeaderNav({
	onBack,
	withTrailingSeparator = false,
}: ExecutionLogsHeaderNavProps) {
	return (
		<>
			<ToggleLeftPanelButton
				ariaLabel={(open) =>
					open ? "Close executions list" : "Open executions list"
				}
			/>
			<Separator orientation="vertical" />
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
			{withTrailingSeparator && <Separator orientation="vertical" />}
		</>
	);
}
