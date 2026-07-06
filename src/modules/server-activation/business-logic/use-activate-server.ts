import {
	type ActivateServerResponse,
	activateServer as activateServerRequest,
} from "@/modules/server-activation/domain/activate-server";
import type { FetchError } from "@zenml/shared-kitaru/api/domain";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
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
	const { kitaruApiClient } = useKitaruApiRuntime();
	const mutation = useMutation({
		...options,
		mutationFn: (payload) =>
			activateServerRequest(payload, { kitaruApiClient }),
	});

	return {
		...mutation,
		activateServer: mutation.mutate,
		activateServerAsync: mutation.mutateAsync,
	};
}
