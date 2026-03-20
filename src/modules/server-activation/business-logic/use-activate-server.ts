import {
	type ActivateServerResponse,
	activateServer as activateServerRequest,
} from "@/modules/server-activation/domain/activate-server";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { ServerActivationRequest } from "../domain/server-activation-types";

export function useActivateServer(
	options?: Omit<
		UseMutationOptions<
			ActivateServerResponse,
			FetchError,
			ServerActivationRequest,
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
