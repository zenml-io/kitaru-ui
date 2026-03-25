import type { components } from "@/shared/api/openapi";
import { getIsActiveStatus } from "./status";
import { useNow } from "./use-now";

type Status = components["schemas"]["ExecutionStatus"];

export function useLiveDurationMs({
	status,
	startTime,
	durationMs,
}: {
	status?: Status;
	startTime?: Date;
	durationMs?: number;
}): number | undefined {
	const isActive = getIsActiveStatus(status);
	const now = useNow(isActive);

	if (isActive && startTime) {
		const elapsed = now.getTime() - startTime.getTime();
		if (elapsed > 0) return elapsed;
	}

	if (durationMs && durationMs > 0) return durationMs;

	return undefined;
}
