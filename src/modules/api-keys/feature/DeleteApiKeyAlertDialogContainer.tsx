import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { DeleteAlertDialog } from "@/shared/ui/DeleteAlertDialog";

import { apiKeyQueryKeys } from "../business-logic/api-key-queries";
import { getErrorMessage } from "../business-logic/get-error-message";
import { useDeleteApiKey } from "../business-logic/use-delete-api-key";
import type { ApiKey } from "../domain/api-key";

type DeleteApiKeyAlertDialogContainerProps = {
	serviceAccountId: string;
	apiKey: ApiKey;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function DeleteApiKeyAlertDialogContainer({
	serviceAccountId,
	apiKey,
	open,
	onOpenChange,
}: DeleteApiKeyAlertDialogContainerProps) {
	const queryClient = useQueryClient();
	const { deleteApiKey, isPending } = useDeleteApiKey({
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: apiKeyQueryKeys.list(serviceAccountId),
			});
			toast.success("API key deleted");
			onOpenChange(false);
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete API key.")),
	});

	return (
		<DeleteAlertDialog
			title="Delete API key"
			description={`Are you sure you want to delete "${apiKey.name}"? This action cannot be undone and will immediately revoke access.`}
			open={open}
			onOpenChange={onOpenChange}
			onConfirm={() => deleteApiKey({ serviceAccountId, apiKeyId: apiKey.id })}
			isPending={isPending}
			actionLabel="Delete API key"
			pendingLabel="Deleting..."
		/>
	);
}
