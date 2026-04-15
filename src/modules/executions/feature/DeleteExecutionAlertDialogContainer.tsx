import { DeleteAlertDialog } from "@/shared/ui/DeleteAlertDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
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

	return (
		<DeleteAlertDialog
			title="Delete execution?"
			description="This action is irreversible. All associated steps, logs, and artifacts will be permanently removed."
			open={open}
			onOpenChange={onOpenChange}
			onConfirm={() => deleteExecution(executionId)}
			isPending={isPending}
			actionLabel="Delete execution"
		/>
	);
}
