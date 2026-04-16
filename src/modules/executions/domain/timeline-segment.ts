import type { TimelineEntry } from "./waiting-block";

export type TimelineSegment = {
	id: string;
	name: string;
	type: string;
	durationMs: number;
	entry: TimelineEntry;
};
