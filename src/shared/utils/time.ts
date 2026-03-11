import { formatDistanceToNowStrict, parseISO } from "date-fns";

export function formatRelativeTime(value: Date | string) {
	const date = typeof value === "string" ? parseISO(value) : value;

	return formatDistanceToNowStrict(date, {
		addSuffix: true,
	});
}
