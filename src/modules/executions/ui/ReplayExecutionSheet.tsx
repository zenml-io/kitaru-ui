import { Button } from "@/shared/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { executionsQueryKeys } from "../business-logic/executions-queries";
import { useReplayExecution } from "../business-logic/use-replay-execution";

type ReplayExecutionSheetProps = {
	executionId: string;
	executionNumber: string;
};

export function ReplayExecutionSheet({
	executionId,
	executionNumber,
}: ReplayExecutionSheetProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { flowId } = useParams({
		from: "/_private/_navbar/flows/$flowId/executions/$executionId",
	});
	const { replayExecution, isPending } = useReplayExecution({
		onSuccess: (exec) => {
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.all(flowId),
			});
			navigate({
				to: "/flows/$flowId/executions/$executionId",
				params: { flowId, executionId: exec.id },
			});
			setOpen(false);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to replay execution");
		},
	});

	function handleReplay() {
		replayExecution({ executionId });
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={<Button variant="outline" type="button" size="sm" />}
			>
				<Play className="size-3.5" />
				Replay
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Replay Execution #{executionNumber}?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This will start a new execution using the same configuration.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleReplay} disabled={isPending}>
						{isPending ? "Replaying..." : "Replay"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
