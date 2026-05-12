import {
	keepPreviousData,
	useQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { FetchFlowsParams } from "./flows-queries";
import { flowsQueries } from "./flows-queries";

type SuspenseOptions = Omit<
	ReturnType<typeof flowsQueries.list>,
	"queryKey" | "queryFn"
>;

export function useFlows(opts: SuspenseOptions = {}) {
	const query = useSuspenseQuery({
		...flowsQueries.list(),
		...opts,
	});

	return { ...query, flowsData: query.data };
}

export function useFilteredFlows(
	params: FetchFlowsParams,
	opts: SuspenseOptions = {}
) {
	const query = useQuery({
		...flowsQueries.list(params),
		placeholderData: keepPreviousData,
		...opts,
	});

	return { ...query, flowsData: query.data ?? [] };
}
