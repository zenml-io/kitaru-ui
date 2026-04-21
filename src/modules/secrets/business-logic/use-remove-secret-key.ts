import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import type { Secret } from "../domain/secrets";
import { getErrorMessage } from "./get-error-message";
import { secretQueryKeys } from "./secret-queries";
import { useUpdateSecret } from "./use-update-secret";

export function useRemoveSecretKey(secret: Secret) {
	const queryClient = useQueryClient();
	const [keyToDelete, setKeyToDelete] = useState<string | undefined>();

	const { updateSecret, isPending } = useUpdateSecret({
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: secretQueryKeys.all });
			setKeyToDelete(undefined);
			toast.success("Key removed");
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not remove key.")),
	});

	function requestRemove(keyName: string) {
		setKeyToDelete(keyName);
	}

	function cancelRemove() {
		setKeyToDelete(undefined);
	}

	function confirmRemove() {
		if (keyToDelete === undefined) return;
		const exists = secret.keys.some((k) => k.key === keyToDelete);
		if (!exists) {
			setKeyToDelete(undefined);
			return;
		}
		const remaining = secret.keys.filter((k) => k.key !== keyToDelete);
		if (remaining.length === 0) {
			toast.error("A secret must contain at least one key.");
			return;
		}
		updateSecret({
			secretId: secret.id,
			payload: { name: secret.name, keys: remaining },
		});
	}

	return {
		keyToDelete,
		requestRemove,
		cancelRemove,
		confirmRemove,
		isPending,
	};
}
