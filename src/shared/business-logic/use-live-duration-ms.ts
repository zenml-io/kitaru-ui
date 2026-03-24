import type { components } from "@/shared/api/openapi";
import { getIsActiveStatus } from "./status";
import { useNow } from "./use-now";

type Status = components["schemas"]["ExecutionStatus"];

export function useLiveDurationMs({
	status,
	startTime,
	durationMs,
}: {
	status: Status | undefined;
	startTime: Date | undefined;
	durationMs: number | undefined;
}): number | undefined {
	const isActive = getIsActiveStatus(status);
	const now = useNow(isActive);

	if (isActive && startTime) {
		return now.getTime() - startTime.getTime();
	}
	return durationMs;
}
