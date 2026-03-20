import { useSuspenseQuery } from "@tanstack/react-query";
import { serverInfoQueries } from "../business-logic/server-info-queries";
import { LoginCommand } from "../ui/LoginCommand";

export function LoginCommandContainer() {
	const { data: serverInfo } = useSuspenseQuery(serverInfoQueries.detail());
	const url = serverInfo.server_url || location.origin;
	return (
		<div className="px-2 py-1.5">
			<span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
				Login
			</span>
			<div className="mt-1.5 flex items-center gap-1">
				<LoginCommand url={url} />
			</div>
		</div>
	);
}
