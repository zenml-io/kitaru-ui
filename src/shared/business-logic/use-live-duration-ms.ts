import type { components } from "@/shared/api/openapi";
import { getIsActiveStatus } from "./status";
import { useNow } from "./use-now";

type Status = components["schemas"]["ExecutionStatus"];

export function useLiveDurationMs({
	status,
	startTime,
	endTime,
	durationMs,
}: {
	status: Status | undefined;
	startTime: Date | undefined;
	endTime?: Date | undefined;
	durationMs?: number | undefined;
}): number | undefined {
	const isActive = getIsActiveStatus(status);
	const now = useNow(isActive);

	const effectiveEnd = isActive ? now : endTime;

	if (startTime && effectiveEnd) {
		return effectiveEnd.getTime() - startTime.getTime();
	}
	return durationMs;
}
