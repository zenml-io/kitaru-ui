import { useServerInfo } from "@/modules/root/business-logic/use-server-info";
import { useCurrentUser } from "@/modules/users/business-logic/use-current-user";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { buildPageEvent } from "../business-logic/build-page-event";
import { sendAnalyticsEvents } from "../domain/send-analytics-event";

export function PageAnalyticsContainer() {
	const { serverInfoData: serverInfo } = useServerInfo();
	const { currentUserData: user } = useCurrentUser();
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
