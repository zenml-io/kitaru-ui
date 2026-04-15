import { Button } from "@/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { DotsHorizontal, Trash01 } from "@untitledui/icons";
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
							<DotsHorizontal />
							<span className="sr-only">Open actions</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-44">
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash01 className="size-4" /> Delete execution
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
