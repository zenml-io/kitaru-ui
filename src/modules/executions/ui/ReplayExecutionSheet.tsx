import { Button } from "@/shared/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/sheet";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { useReplayExecution } from "../business-logic/use-replay-execution";
import { useNavigate, useParams } from "@tanstack/react-router";

type ReplayExecutionSheetProps = {
	executionId: string;
	executionNumber: string;
	snapshotId: string;
};

export function ReplayExecutionSheet({
	executionId,
	executionNumber,
}: ReplayExecutionSheetProps) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const { replayExecution, isPending } = useReplayExecution({
		onSuccess: (exec) => {
			navigate({
				to: "/flows/$flowId/executions/$executionId",
				params: { flowId, executionId: exec.id },
			});
			setOpen(false);
		},
	});
	// const { data: deployment } = useDeployment(snapshotId);

	function handleReplay() {
		replayExecution({ executionId });
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={<Button variant="outline" type="button" size="sm" />}
			>
				<Play className="size-3.5" />
				Replay
			</SheetTrigger>
			<SheetContent className="sm:max-w-1/2" showCloseButton={false}>
				<div className="border-border flex items-center justify-between border-b px-4 py-3">
					<SheetTitle className="text-sm font-semibold">
						Replay Execution #{executionNumber}
					</SheetTitle>
					<SheetClose render={<Button variant="ghost" size="icon-sm" />}>
						<X className="size-4" />
						<span className="sr-only">Close</span>
					</SheetClose>
				</div>

				<Button onClick={handleReplay} disabled={isPending}>
					Replay
				</Button>
				{/* {deployment.flowName} */}
			</SheetContent>
		</Sheet>
	);
}
