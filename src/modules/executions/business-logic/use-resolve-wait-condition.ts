import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
	resolveWaitConditionRequest,
	type ResolveWaitConditionParams,
} from "../domain/resolve-wait-condition";

export function useResolveWaitCondition(
	options?: Omit<
		UseMutationOptions<void, FetchError, ResolveWaitConditionParams, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: resolveWaitConditionRequest,
	});

	return {
		...mutation,
		resolveWaitCondition: mutation.mutate,
		resolveWaitConditionAsync: mutation.mutateAsync,
	};
}
