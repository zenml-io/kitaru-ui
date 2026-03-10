import {
	type ActivateServerResponse,
	activateServer as activateServerRequest,
} from "@/modules/server-activation/domain/activate-server";
import type { ServerActivationPayload } from "@/modules/server-activation/domain/server-activation-schema";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

export function useActivateServer(
	options?: Omit<
		UseMutationOptions<
			ActivateServerResponse,
			FetchError,
			ServerActivationPayload,
			unknown
		>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: activateServerRequest,
	});

	return {
		...mutation,
		activateServer: mutation.mutate,
		activateServerAsync: mutation.mutateAsync,
	};
}
