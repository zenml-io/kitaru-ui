import { serverInfoQueries } from "@/modules/root/business-logic/server-info-queries";
import { userQueries } from "@/modules/users/business-logic/user-queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { buildPageEvent } from "../business-logic/build-page-event";
import { sendAnalyticsEvents } from "../domain/send-analytics-event";

export function PageAnalyticsContainer() {
	const { data: serverInfo } = useSuspenseQuery(serverInfoQueries.detail());
	const { data: user } = useSuspenseQuery(userQueries.currentUser());
	const { subscribe } = useRouter();

	useEffect(() => {
		if (!serverInfo.analytics_enabled) return;
		const unsubscribe = subscribe("onRendered", () => {
			const pageEvent = buildPageEvent(
				"Kitaru UI",
				"",
				{ userId: user.id, isDebug: serverInfo.debug ?? false },
				{
					server_id: serverInfo.id,
					...serverInfo.metadata,
				}
			);

			sendAnalyticsEvents({ events: [pageEvent] });
		});

		return () => {
			unsubscribe();
		};
	}, [
		subscribe,
		serverInfo.id,
		serverInfo.metadata,
		user.id,
		serverInfo.analytics_enabled,
		serverInfo.debug,
	]);

	return null;
}
