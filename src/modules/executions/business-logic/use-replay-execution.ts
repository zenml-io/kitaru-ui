import type { FetchError } from "@/shared/api/domain/fetch-error";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { Execution } from "../domain/execution";
import {
	replayExecution,
	type ReplayExecutionParams,
} from "../domain/replay-execution";

export function useReplayExecution(
	options?: Omit<
		UseMutationOptions<Execution, FetchError, ReplayExecutionParams, unknown>,
		"mutationFn"
	>
) {
	const mutation = useMutation({
		...options,
		mutationFn: ({ executionId, payload }) =>
			replayExecution({ executionId, payload }),
	});

	return {
		...mutation,
		replayExecution: mutation.mutate,
		replayExecutionAsync: mutation.mutateAsync,
	};
}
