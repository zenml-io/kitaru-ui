import { Button } from "@zenml/hashi/primitives/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { User } from "../domain/users";
import { useState } from "react";
import { RemoveMemberAlertDialog } from "../feature/RemoveMemberAlertDialog";

type MembersRowActionsProps = {
	member: User;
	isCurrentUser: boolean;
};

export function MembersRowActions({
	member,
	isCurrentUser,
}: MembersRowActionsProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	if (isCurrentUser) {
		return null;
	}

	return (
		<>
			<RemoveMemberAlertDialog
				toDeleteMember={member}
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label={`Open actions for ${member.name}`}
						>
							<MoreHorizontal />
							<span className="sr-only">Open row actions</span>
						</Button>
					}
				/>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setShowDeleteDialog(true)}
					>
						<Trash2 className="size-4" /> Remove member
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
