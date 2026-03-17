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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteUser } from "../business-logic/use-delete-user";
import { userQueryKeys } from "../business-logic/user-queries";
import type { User } from "../domain/users";

type RemoveMemberAlertDialogProps = {
	toDeleteMember: User;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function RemoveMemberAlertDialog({
	toDeleteMember,
	open,
	onOpenChange,
}: RemoveMemberAlertDialogProps) {
	const queryClient = useQueryClient();
	const memberName = toDeleteMember?.name ?? "this member";

	const { deleteUser, isPending: isDeletePending } = useDeleteUser({
		onSuccess: () => {
			onOpenChange(false);
			queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
			queryClient.invalidateQueries({ queryKey: userQueryKeys.current });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	function handleConfirm() {
		deleteUser(toDeleteMember.id);
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove member?</AlertDialogTitle>
					<AlertDialogDescription>
						You're about to remove {memberName} from this workspace. They will
						immediately lose access, and this can't be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={isDeletePending}
						onClick={handleConfirm}
					>
						{isDeletePending ? "Removing..." : "Remove member"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
