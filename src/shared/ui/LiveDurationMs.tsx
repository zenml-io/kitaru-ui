import { useLiveDurationMs } from "@/shared/business-logic/use-live-duration-ms";
import { formatDurationShort } from "@/shared/utils/time";
import type { components } from "@/shared/api/openapi";

type Status = components["schemas"]["ExecutionStatus"];

type LiveDurationMsProps = {
	status?: Status;
	startTime?: Date;
	endTime?: Date;
	durationMs?: number;
	className?: string;
};

export function LiveDurationMs({
	status,
	startTime,
	endTime,
	durationMs,
	className,
}: LiveDurationMsProps) {
	const liveDurationMs = useLiveDurationMs({
		status,
		startTime,
		endTime,
		durationMs,
	});

	if (!liveDurationMs || liveDurationMs <= 0) return null;

	return (
		<span className={className}>{formatDurationShort(liveDurationMs)}</span>
	);
}
