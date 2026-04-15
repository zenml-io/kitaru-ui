import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Input } from "@/shared/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { executionsQueryKeys } from "../business-logic/executions-queries";
import { useDeleteExecution } from "../business-logic/use-delete-execution";

type DeleteExecutionAlertDialogContainerProps = {
	executionId: string;
	flowId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function DeleteExecutionAlertDialogContainer({
	executionId,
	flowId,
	open,
	onOpenChange,
}: DeleteExecutionAlertDialogContainerProps) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const [confirmText, setConfirmText] = useState("");

	const { deleteExecution, isPending } = useDeleteExecution({
		onSuccess: () => {
			onOpenChange(false);
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.all(flowId),
			});
			toast.success("Execution deleted");
			router.navigate({ to: "/flows/$flowId", params: { flowId } });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const isConfirmed = confirmText === "DELETE";

	function handleConfirm() {
		if (!isConfirmed) return;
		deleteExecution(executionId);
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			setConfirmText("");
		}
		onOpenChange(nextOpen);
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete execution?</AlertDialogTitle>
					<AlertDialogDescription>
						This action is irreversible. All associated steps, logs, and
						artifacts will be permanently removed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="delete-confirm"
						className="text-muted-foreground text-sm"
					>
						Type <span className="text-foreground font-medium">DELETE</span> to
						confirm
					</label>
					<Input
						id="delete-confirm"
						value={confirmText}
						onChange={(e) => setConfirmText(e.target.value)}
						onPaste={(e) => e.preventDefault()}
						placeholder="DELETE"
						autoComplete="off"
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={!isConfirmed || isPending}
						onClick={handleConfirm}
					>
						{isPending ? "Deleting..." : "Delete execution"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
