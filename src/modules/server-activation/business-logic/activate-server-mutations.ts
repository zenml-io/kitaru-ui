import {
	type ActivateServerResponse,
	activateServer,
} from "@/modules/server-activation/domain/activate-server";
import type { ServerActivationPayload } from "@/modules/server-activation/domain/server-activation-schema";
import type { FetchError } from "@/shared/api/domain/fetch-error";
import {
	type UseMutationOptions,
	mutationOptions,
} from "@tanstack/react-query";

export function activateServerMutationOptions(
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
	return mutationOptions({
		...options,
		mutationFn: activateServer,
	});
}
