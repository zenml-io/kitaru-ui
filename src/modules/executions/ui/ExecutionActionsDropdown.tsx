import { Button } from "@zenml/hashi/primitives/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteExecutionAlertDialogContainer } from "../feature/DeleteExecutionAlertDialogContainer";

type ExecutionActionsDropdownProps = {
	executionId: string;
	flowId: string;
};

export function ExecutionActionsDropdown({
	executionId,
	flowId,
}: ExecutionActionsDropdownProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<DeleteExecutionAlertDialogContainer
				executionId={executionId}
				flowId={flowId}
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Open execution actions"
						>
							<MoreHorizontal />
							<span className="sr-only">Open actions</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-44">
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="size-4" /> Delete execution
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
