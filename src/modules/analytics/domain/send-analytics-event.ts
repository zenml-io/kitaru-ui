import { env } from "@/modules/root/domain/env";
import type { AnalyticsEvent } from "./analytics-events";

const analyticsServerUrl = env.VITE_ANALYTICS_SERVER_URL;

export async function sendAnalyticsEvents({
	events,
}: {
	events: AnalyticsEvent[];
}) {
	if (events.length === 0 || !analyticsServerUrl) {
		return;
	}

	await fetch(analyticsServerUrl, {
		method: "POST",
		credentials: "omit",
		headers: {
			"Content-Type": "application/json",
			"Source-Context": "kitaru-ui",
		},
		body: JSON.stringify(events),
	});
}
