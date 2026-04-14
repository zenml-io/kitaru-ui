import type { TimelineSegment } from "../domain/timeline-segment";
import type { TimelineEntry } from "../domain/waiting-block";

export function timelineEntryToSegment(
	entry: TimelineEntry
): TimelineSegment | null {
	if (entry.kind === "checkpoint") {
		const durationMs = Math.max(entry.data.durationMs ?? 0, 0);
		return {
			id: entry.data.id,
			name: entry.data.name,
			type: entry.data.type ?? "",
			durationMs,
			entry,
		};
	}
	if (entry.data.waitDurationMs === undefined) return null;
	return {
		id: entry.data.id,
		name: "User Input",
		type: "wait",
		durationMs: Math.max(entry.data.waitDurationMs, 0),
		entry,
	};
}
