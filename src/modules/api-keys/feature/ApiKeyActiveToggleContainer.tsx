import { useQueryClient } from "@tanstack/react-query";
import { useKitaruContext } from "@zenml/shared-kitaru/contexts";
import { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@zenml/hashi/primitives/switch";

import { apiKeyQueryKeys } from "../business-logic/api-key-queries";
import { getErrorMessage } from "../business-logic/get-error-message";
import { useUpdateApiKey } from "../business-logic/use-update-api-key";
import type { ApiKey } from "../domain/api-key";
import { DeactivateApiKeyAlertDialog } from "../ui/DeactivateApiKeyAlertDialog";

type ApiKeyActiveToggleContainerProps = {
	serviceAccountId: string;
	apiKey: ApiKey;
};

export function ApiKeyActiveToggleContainer({
	serviceAccountId,
	apiKey,
}: ApiKeyActiveToggleContainerProps) {
	const queryClient = useQueryClient();
	const { scopeKey } = useKitaruContext();
	const [showDeactivate, setShowDeactivate] = useState(false);

	const { updateApiKey, isPending } = useUpdateApiKey({
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: apiKeyQueryKeys.list(scopeKey, serviceAccountId),
			}),
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update API key.")),
	});

	const isActive = apiKey.active ?? true;

	function handleCheckedChange(nextChecked: boolean) {
		if (nextChecked === isActive) return;
		if (!nextChecked) {
			setShowDeactivate(true);
			return;
		}
		updateApiKey({
			serviceAccountId,
			apiKeyId: apiKey.id,
			active: true,
		});
	}

	function handleConfirmDeactivate() {
		updateApiKey(
			{ serviceAccountId, apiKeyId: apiKey.id, active: false },
			{ onSettled: () => setShowDeactivate(false) }
		);
	}

	return (
		<>
			<Switch
				aria-label={`Toggle active for ${apiKey.name}`}
				checked={isActive}
				disabled={isPending}
				onCheckedChange={handleCheckedChange}
			/>
			{showDeactivate && (
				<DeactivateApiKeyAlertDialog
					apiKey={apiKey}
					open={showDeactivate}
					onOpenChange={setShowDeactivate}
					onConfirm={handleConfirmDeactivate}
					isPending={isPending}
				/>
			)}
		</>
	);
}
