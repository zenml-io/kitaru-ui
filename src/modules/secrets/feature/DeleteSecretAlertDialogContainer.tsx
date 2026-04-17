import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { DeleteAlertDialog } from "@/shared/ui/DeleteAlertDialog";

import { secretQueryKeys } from "../business-logic/secret-queries";
import { useDeleteSecret } from "../business-logic/use-delete-secret";
import type { Secret } from "../domain/secrets";

type DeleteSecretAlertDialogContainerProps = {
	secret: Secret;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleted?: () => void;
};

export function DeleteSecretAlertDialogContainer({
	secret,
	open,
	onOpenChange,
	onDeleted,
}: DeleteSecretAlertDialogContainerProps) {
	const queryClient = useQueryClient();

	const { deleteSecret, isPending } = useDeleteSecret({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			onOpenChange(false);
			onDeleted?.();
		},
		onError: (error) => toast.error(error.message),
	});

	return (
		<DeleteAlertDialog
			title="Delete secret?"
			description={`You're about to delete "${secret.name}". This can't be undone.`}
			open={open}
			onOpenChange={onOpenChange}
			onConfirm={() => deleteSecret(secret.id)}
			isPending={isPending}
			actionLabel="Delete secret"
			pendingLabel="Deleting..."
		/>
	);
}
