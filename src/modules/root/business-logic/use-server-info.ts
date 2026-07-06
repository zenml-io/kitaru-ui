import { useSuspenseQuery } from "@tanstack/react-query";
import { useKitaruApiRuntime } from "@zenml/shared-kitaru/contexts";
import { serverInfoQueries } from "./server-info-queries";

type SuspenseOptions = Omit<
	ReturnType<typeof serverInfoQueries.detail>,
	"queryKey" | "queryFn"
>;

export function useServerInfo(opts: SuspenseOptions = {}) {
	const kitaruApiRuntime = useKitaruApiRuntime();
	const query = useSuspenseQuery({
		...serverInfoQueries.detail(kitaruApiRuntime),
		...opts,
	});

	return { ...query, serverInfoData: query.data };
}
