import { useEffect, useRef } from "react";
import type { ExecutionStatus } from "../domain/execution";
import { useQueryClient } from "@tanstack/react-query";

export function useSyncExecutionStatus(
	executionStatus: ExecutionStatus | undefined
) {
	const previousExecutionStatus = useRef<ExecutionStatus | null>(null);
	const queryClient = useQueryClient();
	useEffect(() => {
		if (executionStatus) {
			const currentStatus = executionStatus;
			if (
				previousExecutionStatus.current !== null &&
				previousExecutionStatus.current !== currentStatus
			) {
				queryClient.invalidateQueries({
					queryKey: ["executions"],
				});
			}
			previousExecutionStatus.current = currentStatus;
		}
	}, [executionStatus, queryClient]);
}
