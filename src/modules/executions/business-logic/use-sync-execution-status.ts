import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { ExecutionStatus } from "../domain/execution";
import { executionsQueryKeys } from "./executions-queries";

export function useSyncExecutionStatus(
	executionStatus: ExecutionStatus | undefined,
	hasPendingWaitConditionNode: boolean
) {
	const previousExecutionStatus = useRef<ExecutionStatus | null>(null);
	const previousHasPendingWaitConditionNode = useRef<boolean | null>(null);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!executionStatus) {
			return;
		}

		const currentStatus = executionStatus;
		const hasExecutionStatusChanged =
			previousExecutionStatus.current !== null &&
			previousExecutionStatus.current !== currentStatus;
		const hasWaitConditionChangedToPending =
			previousHasPendingWaitConditionNode.current !== null &&
			previousHasPendingWaitConditionNode.current === false &&
			hasPendingWaitConditionNode;

		if (hasExecutionStatusChanged || hasWaitConditionChangedToPending) {
			queryClient.invalidateQueries({
				queryKey: executionsQueryKeys.base,
			});
		}

		previousExecutionStatus.current = currentStatus;
		previousHasPendingWaitConditionNode.current = hasPendingWaitConditionNode;
	}, [executionStatus, hasPendingWaitConditionNode, queryClient]);
}
