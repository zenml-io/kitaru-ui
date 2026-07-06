import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import {
	findOrCreatePersonalServiceAccount,
	type PersonalServiceAccount,
} from "../domain/find-or-create-personal-service-account";

export function useFindOrCreatePersonalServiceAccount(
	options?: Omit<
		UseMutationOptions<PersonalServiceAccount, FetchError, string, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (userId) =>
			findOrCreatePersonalServiceAccount({ userId }, { kitaruApiClient }),
	});

	return {
		...mutation,
		findOrCreatePersonalServiceAccount: mutation.mutate,
		findOrCreatePersonalServiceAccountAsync: mutation.mutateAsync,
	};
}
