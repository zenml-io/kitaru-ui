import { useQueryClient } from "@tanstack/react-query";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@zenml/hashi/primitives/alert-dialog";
import { Button } from "@zenml/hashi/primitives/button";
import { useKitaruContext } from "@zenml/shared-kitaru/contexts";
import { toast } from "sonner";
import { useDeleteUser } from "../business-logic/use-delete-user";
import { userQueryKeys } from "../business-logic/user-queries";
import type { KitaruUser } from "../domain/users";

type RemoveMemberAlertDialogProps = {
	toDeleteMember: KitaruUser;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function RemoveMemberAlertDialog({
	toDeleteMember,
	open,
	onOpenChange,
}: RemoveMemberAlertDialogProps) {
	const queryClient = useQueryClient();
	const { scopeKey } = useKitaruContext();
	const memberName = toDeleteMember?.name ?? "this member";

	const { deleteUser, isPending: isDeletePending } = useDeleteUser({
		onSuccess: () => {
			onOpenChange(false);
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.all(scopeKey),
			});
			queryClient.invalidateQueries({
				queryKey: userQueryKeys.current(scopeKey),
			});
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
					<Button
						variant="destructive"
						disabled={isDeletePending}
						onClick={handleConfirm}
					>
						{isDeletePending ? "Removing..." : "Remove member"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
