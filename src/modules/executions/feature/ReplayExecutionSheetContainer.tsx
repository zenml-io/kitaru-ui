import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { executionsQueryKeys } from "../business-logic/executions-queries";
import { useReplayExecution } from "../business-logic/use-replay-execution";
import type { ExecutionStatus } from "../domain/execution";
import type { ReplayExecutionFormValues } from "../domain/replay-execution-schema";
import { ReplayExecutionFormContainer } from "./ReplayExecutionFormContainer";

type ReplayExecutionSheetProps = {
	executionId: string;
	executionNumber: string;
	executionStatus?: ExecutionStatus;
};

const FORM_ID = "replay-execution-form";

export function ReplayExecutionSheetContainer({
	executionId,
	executionNumber,
	executionStatus,
}: ReplayExecutionSheetProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { flowId, version } = useParams({
		from: "/_private/_navbar/flows/$flowId/v/$version/executions/$executionId",
	});
	const { replayExecution, isPending } = useReplayExecution({
		onSuccess: (exec) => {
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.all(flowId),
			});
			navigate({
				to: "/flows/$flowId/v/$version/executions/$executionId",
				params: { flowId, version, executionId: exec.id },
			});
			setOpen(false);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to replay execution");
		},
	});

	function handleReplay({ skipSuccessfulSteps }: ReplayExecutionFormValues) {
		replayExecution({
			executionId,
			payload: { skip_successful_steps: skipSuccessfulSteps },
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={<Button variant="outline" type="button" size="sm" />}
			>
				<Play className="size-3.5" />
				Replay
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Replay Execution #{executionNumber}</DialogTitle>
					<DialogDescription>
						This will trigger a replay of the execution.
					</DialogDescription>
				</DialogHeader>
				<ReplayExecutionFormContainer
					formId={FORM_ID}
					isExecutionFailed={executionStatus === "failed"}
					onSubmit={handleReplay}
				/>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button type="submit" form={FORM_ID} disabled={isPending}>
						{isPending ? "Replaying..." : "Replay"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
