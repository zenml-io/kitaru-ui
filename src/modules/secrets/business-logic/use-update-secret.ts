import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { Secret } from "../domain/secrets";
import {
	updateSecretRequest,
	type UpdateSecretPayload,
} from "../domain/update-secret";

type UpdateSecretVars = {
	secretId: string;
	payload: UpdateSecretPayload;
};

export function useUpdateSecret(
	options?: Omit<
		UseMutationOptions<Secret, FetchError, UpdateSecretVars, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: ({ secretId, payload }: UpdateSecretVars) =>
			updateSecretRequest(secretId, payload),
	});

	return {
		...mutation,
		updateSecret: mutation.mutate,
		updateSecretAsync: mutation.mutateAsync,
	};
}
