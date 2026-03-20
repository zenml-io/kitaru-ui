import type {
	PageEvent,
	PageEventContext,
	PageEventPage,
	PageEventProperties,
} from "../domain/analytics-events";
import { sanitizeUuidFromPath } from "../util/sanize-uuid";

export function buildPageEvent(
	category: string,
	name: string,
	metadata: { userId: string; isDebug: boolean },
	properties: Record<string, unknown>
) {
	const page: PageEventPage = {
		path: sanitizeUuidFromPath(location.pathname),
		referrer: document.referrer,
		search: location.search,
		title: document.title,
	};
	const context: PageEventContext = {
		locale: navigator.language,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		userAgent: navigator.userAgent,
		page,
	};
	const props: PageEventProperties = { ...page, category, ...properties };

	const pageEvent: PageEvent = {
		type: "page",
		user_id: metadata.userId,
		debug: metadata.isDebug,
		name,
		category,
		context,
		properties: props,
	};

	return pageEvent;
}
