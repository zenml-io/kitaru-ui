import { useSuspenseQuery } from "@tanstack/react-query";
import { serverInfoQueries } from "../business-logic/server-info-queries";
import { LoginCommand } from "../ui/LoginCommand";

export function LoginCommandContainer() {
	const { data: serverInfo } = useSuspenseQuery(serverInfoQueries.detail());
	const url = serverInfo.server_url || location.origin;
	return <LoginCommand url={url} />;
}
