import { ANALYTICS_SERVER_URL } from "./analytics-config";
import type { AnalyticsEvent } from "./analytics-events";

export async function sendAnalyticsEvents({
	events,
}: {
	events: AnalyticsEvent[];
}) {
	if (events.length === 0) {
		return;
	}

	await fetch(ANALYTICS_SERVER_URL, {
		method: "POST",
		credentials: "omit",
		headers: {
			"Content-Type": "application/json",
			"Source-Context": "kitaru-ui",
		},
		body: JSON.stringify(events),
	});
}
