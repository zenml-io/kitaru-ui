import {
	type ActivateServerResponse,
	activateServer,
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
	return useMutation({
		...options,
		mutationFn: activateServer,
	});
}
