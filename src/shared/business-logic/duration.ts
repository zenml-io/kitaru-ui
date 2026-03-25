import type { components } from "@/shared/api/openapi";
import { getIsActiveStatus } from "./status";

type Status = components["schemas"]["ExecutionStatus"];

export function getCanShowDuration({
	status,
	startTime,
	durationMs,
	endTime,
}: {
	status?: Status;
	startTime?: Date;
	durationMs?: number;
	endTime?: Date;
}): boolean {
	if (getIsActiveStatus(status)) return startTime !== undefined;
	if (startTime !== undefined && endTime !== undefined) return true;
	return durationMs !== undefined && durationMs > 0;
}
