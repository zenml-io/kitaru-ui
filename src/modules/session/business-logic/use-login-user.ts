import type { LoginPayload } from "@/modules/session/domain/login-schema";
import { loginUser as loginUserRequest } from "@/modules/session/domain/login-user";
import { type LoginSuccessResponse } from "@/modules/session/domain/types";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useLoginUser(
	options?: Omit<
		UseMutationOptions<LoginSuccessResponse, FetchError, LoginPayload, unknown>,
		"mutationFn"
	>
) {
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload) => loginUserRequest(payload, { kitaruApiClient }),
	});

	return {
		...mutation,
		loginUser: mutation.mutate,
		loginUserAsync: mutation.mutateAsync,
	};
}
