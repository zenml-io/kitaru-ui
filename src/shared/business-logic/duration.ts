import type { components } from "@/shared/api/openapi";
import { getIsActiveStatus } from "./status";

type Status = components["schemas"]["ExecutionStatus"];

export function getCanShowDuration({
	status,
	startTime,
	durationMs,
}: {
	status: Status | undefined;
	startTime: Date | undefined;
	durationMs?: number | undefined;
}): boolean {
	if (getIsActiveStatus(status)) return startTime !== undefined;
	return durationMs !== undefined && durationMs > 0;
}
