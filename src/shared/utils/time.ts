import {
	format,
	formatDistanceToNowStrict,
	intervalToDuration,
	isValid,
	parseISO,
} from "date-fns";

/**
 * Formats the duration between startTime and endTime as a compact string (e.g. "1h 2m 3s").
 * Falls back to elapsed time from startTime to now if endTime is absent.
 * Returns undefined if startTime is absent.
 */
export function formatDuration(
	startTime?: Date,
	endTime?: Date
): string | undefined {
	if (!startTime) return undefined;
	const end = endTime ?? new Date();
	const { hours, minutes, seconds } = intervalToDuration({
		start: startTime,
		end,
	});
	const parts: string[] = [];
	if (hours) parts.push(`${hours}h`);
	if (minutes) parts.push(`${minutes}m`);
	if (seconds || parts.length === 0) parts.push(`${seconds ?? 0}s`);
	return parts.join(" ");
}

/**
 * Formats a duration in milliseconds as a compact string (e.g. "1h 2m", "3m 4s", "500ms").
 */
export function formatDurationShort(ms: number): string {
	if (ms < 1000) return `${Math.round(ms)}ms`;
	const s = Math.floor(ms / 1000);
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	const rs = s % 60;
	if (m < 60) return rs > 0 ? `${m}m ${rs}s` : `${m}m`;
	const h = Math.floor(m / 60);
	const rm = m % 60;
	return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

export function formatRelativeTime(value: Date | string) {
	const date = typeof value === "string" ? parseISO(value) : value;

	return formatDistanceToNowStrict(date, {
		addSuffix: true,
	});
}

export function formatTimestamp(ts: string | null | undefined): string {
	if (!ts) return "";
	const d = new Date(ts);
	if (!isValid(d)) return ts;
	return format(d, "HH:mm:ss.SSS");
}

export function parseBackendTimestamp(dateString: string | number) {
	if (typeof dateString === "number") {
		return new Date(dateString);
	}
	if (!dateString.endsWith("Z")) {
		return new Date(dateString + "Z");
	}
	return new Date(dateString);
}

export function formatBackendTimestamp(date: Date): string {
	return date.toISOString().slice(0, 19).replace("T", " ");
}
