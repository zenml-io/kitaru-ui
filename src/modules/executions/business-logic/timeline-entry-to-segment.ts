import type { TimelineSegment } from "../domain/timeline-segment";
import type { TimelineEntry } from "../domain/waiting-block";

export function timelineEntryToSegment(
	entry: TimelineEntry
): TimelineSegment | null {
	if (entry.kind === "checkpoint") {
		const durationMs = entry.data.durationMs ?? 0;
		if (durationMs <= 0) return null;
		return {
			id: entry.data.id,
			name: entry.data.name,
			type: entry.data.type ?? "",
			durationMs,
			entry,
		};
	}
	const durationMs = entry.data.waitDurationMs ?? 0;
	if (durationMs <= 0) return null;
	return {
		id: entry.data.id,
		name: "User Input",
		type: "wait",
		durationMs,
		entry,
	};
}
